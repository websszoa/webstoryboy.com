-- ============================================
-- 프로필 테이블 생성
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin')),
  visit_count INTEGER DEFAULT 1 NOT NULL, -- 방문 횟수 저장
  is_deleted BOOLEAN DEFAULT FALSE NOT NULL, -- 탈퇴하면 TRUE로 변경
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 프로필 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_deleted ON public.profiles(is_deleted);

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- INSERT: 정책 없음 = 모든 역할(anon, authenticated) INSERT 불가.
--         프로필 생성은 오직 트리거 handle_new_user() (SECURITY DEFINER)만 수행.
-- SELECT/UPDATE: 아래 정책으로 제한. DELETE: 불가 정책만 존재.

-- 기존 정책이 있으면 충돌 방지를 위해 제거
DROP POLICY IF EXISTS "본인 프로필 생성 가능" ON public.profiles;
DROP POLICY IF EXISTS "본인만 프로필 조회 가능" ON public.profiles;
DROP POLICY IF EXISTS "본인만 프로필 수정 가능" ON public.profiles;
DROP POLICY IF EXISTS "관리자는 모든 프로필 조회 가능" ON public.profiles;
DROP POLICY IF EXISTS "관리자는 모든 프로필 수정 가능" ON public.profiles;
DROP POLICY IF EXISTS "직접 삭제 불가" ON public.profiles;

-- [INSERT] 본인 프로필 생성 가능 (누락 방지용)
CREATE POLICY "본인 프로필 생성 가능"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id
    AND role = 'user'
    AND is_deleted = FALSE
  );

-- [SELECT] 본인만 조회 가능 + 탈퇴하지 않은 계정만 (탈퇴 계정은 목록/조회에서 제외)
CREATE POLICY "본인만 프로필 조회 가능"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id AND is_deleted = FALSE);

-- [SELECT] 관리자는 모든 프로필 조회 (JWT app_metadata.role = 'admin', 탈퇴 포함)
CREATE POLICY "관리자는 모든 프로필 조회 가능"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- [UPDATE] 본인만 수정 가능. USING: 탈퇴 전 계정만 수정 시도 가능.
CREATE POLICY "본인만 프로필 수정 가능"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id AND is_deleted = FALSE)
  WITH CHECK (auth.uid() = id);

-- [UPDATE] 관리자는 모든 프로필 수정 가능 (JWT app_metadata.role = 'admin')
CREATE POLICY "관리자는 모든 프로필 수정 가능"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (TRUE);

-- [DELETE] 물리 삭제 불가 (데이터 보존, soft delete만 허용)
CREATE POLICY "직접 삭제 불가"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (FALSE);

-- ============================================
-- 회원가입 시 프로필 자동 생성 트리거
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, visit_count)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'display_name', ''),
      NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
      ''
    ),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'user',
    1
  )
  ON CONFLICT (id) DO NOTHING; -- 혹시 모를 중복 ID 에러 방지(이미 있으면 아무것도 안 함)
  RETURN NEW;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public; -- search_path를 public으로 고정하여 스키마 하이재킹 방지

-- 트리거를 생성하기 전에 기존 트리거를 삭제(충돌 방지)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 회원가입 시 profiles 자동 생성 트리거
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 업데이트 시 프로필 자동 업데이트 트리거
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();   -- UPDATE 발생 시 updated_at을 현재 시간으로 갱신
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거를 생성하기 전에 기존 트리거를 삭제(충돌 방지)
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;

-- profiles 수정 시 updated_at 자동 갱신 트리거
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- role 컬럼 수정 제한 (관리자만 role 변경 가능)
-- ============================================
CREATE OR REPLACE FUNCTION public.check_profile_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- role이 실제로 바뀐 경우에만 검사
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    IF (auth.jwt() -> 'app_metadata' ->> 'role') IS DISTINCT FROM 'admin' THEN
      RAISE EXCEPTION 'role 변경 권한이 없습니다. 관리자만 변경할 수 있습니다.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

DROP TRIGGER IF EXISTS trigger_check_profile_role_change ON public.profiles;
CREATE TRIGGER trigger_check_profile_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.check_profile_role_change();








-- -- 1) role 변경 트리거 잠깐 비활성화
-- alter table public.profiles disable trigger trigger_check_profile_role_change;

-- -- 2) 원하는 유저를 admin으로 변경
-- update public.profiles
-- set role = 'admin'
-- where id = '너의-UUID';

-- -- 3) 트리거 다시 활성화
-- alter table public.profiles enable trigger trigger_check_profile_role_change;