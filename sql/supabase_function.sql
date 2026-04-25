-- ============================================
-- 1. 회원가입 시 프로필 자동 생성 (트리거)
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_insert_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, signup_provider, role, visit_count, is_deleted)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_app_meta_data->>'provider',
    'user',
    0,
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auth_users_after_insert ON auth.users;
CREATE TRIGGER trg_auth_users_after_insert
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.fn_trg_insert_profile();


-- ============================================
-- 2. updated_at 자동 갱신 (트리거)
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();  
  RETURN NEW;
END;
$$;

-- 프로필, 문의, 마라톤 테이블에 각각 적용
DROP TRIGGER IF EXISTS trg_profiles_before_update ON public.profiles;
CREATE TRIGGER trg_profiles_before_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.fn_trg_set_updated_at();

DROP TRIGGER IF EXISTS trg_contacts_before_update ON public.contacts;
CREATE TRIGGER trg_contacts_before_update
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.fn_trg_set_updated_at();


-- ============================================
-- 3. 로그인 시 방문 횟수 증가 (RPC)
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_visit_count()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET visit_count = visit_count + 1
  WHERE id = (select auth.uid())
    AND is_deleted = FALSE;
END;
$$;
 
REVOKE EXECUTE ON FUNCTION public.increment_visit_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_visit_count() TO authenticated;


-- ============================================
-- 4. 회원 탈퇴 (Soft Delete) (RPC)
-- ============================================
CREATE OR REPLACE FUNCTION public.soft_delete_account()
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET
    is_deleted = TRUE,
    deleted_at = NOW()
  WHERE id = (select auth.uid())
    AND is_deleted = FALSE;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.soft_delete_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.soft_delete_account() TO authenticated;


-- ============================================
-- 5. 프로필 이름 중복 확인 (RPC)
-- ============================================
CREATE OR REPLACE FUNCTION public.is_full_name_available(name_text TEXT)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE LOWER(TRIM(full_name)) = LOWER(TRIM(name_text))
      AND is_deleted = FALSE
      AND id != (select auth.uid())
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_full_name_available(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_full_name_available(TEXT) TO authenticated;


-- ============================================
-- 6. 내 계정 탈퇴 여부 체크 (RPC)
-- ============================================
CREATE OR REPLACE FUNCTION public.is_my_account_deleted()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_deleted
     FROM public.profiles
     WHERE id = (select auth.uid())),
    FALSE
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_my_account_deleted() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_my_account_deleted() TO authenticated;



-- ============================================
-- 최종 기능 요약
-- ============================================
--
-- [Trigger]
--  1. 회원가입 시 profiles 자동 생성 (signup_provider: app_metadata->>'provider')
--     함수: fn_trg_insert_profile()
--     트리거: trg_auth_users_after_insert (auth.users AFTER INSERT)
--
--  2. updated_at 자동 갱신
--     함수: fn_trg_set_updated_at()
--     트리거: trg_profiles_before_update (profiles BEFORE UPDATE)
--            trg_contacts_before_update (contacts BEFORE UPDATE)
--
-- [RPC]
--  1. increment_visit_count()            — 로그인 시 방문 횟수 증가
--  2. soft_delete_account()              — 회원 탈퇴(소프트 삭제)
--  3. is_full_name_available(name_text)  — 프로필 이름 중복 확인
--  4. is_my_account_deleted()            — 내 계정 탈퇴 여부 확인
--


