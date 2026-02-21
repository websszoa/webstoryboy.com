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
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, visit_count, is_deleted)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
      NULLIF(TRIM(NEW.raw_user_meta_data->>'display_name'), '')
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    'user',
    1,
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
-- 2. 업데이트 시 자동 갱신 (트리거)
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_set_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();  
  RETURN NEW;
END;
$$;

-- 프로필
DROP TRIGGER IF EXISTS trg_profiles_before_update ON public.profiles;
CREATE TRIGGER trg_profiles_before_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.fn_trg_set_updated_at();

-- 문의하기
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
  WHERE id = auth.uid()
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
  WHERE id = auth.uid()
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
      AND id != auth.uid()
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_full_name_available(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_full_name_available(TEXT) TO authenticated;


-- ============================================
-- 6. 내 계정 탈퇴 여부 확인 (RPC)
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
     WHERE id = auth.uid()),
    FALSE
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_my_account_deleted() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_my_account_deleted() TO authenticated;


-- ============================================
-- 7. 관리자 권한 상승 완벽 차단 (트리거)
-- ============================================
CREATE OR REPLACE FUNCTION public.fn_trg_prevent_role_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- role 값이 변경되려고 할 때만 작동
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- 시스템 롤(service_role 등)이면 무사 통과
    IF current_setting('role', true) IN ('service_role', 'postgres', 'supabase_admin') THEN
      RETURN NEW;
    END IF;

    -- 그 외(프론트엔드에서 로그인한 일반 유저)가 role을 바꾸려 하면 무조건 차단
    RAISE EXCEPTION '접근 거부: 역할(role) 변경은 서버(service_role)에서만 가능합니다.';
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_before_update_role ON public.profiles;
CREATE TRIGGER trg_profiles_before_update_role
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.fn_trg_prevent_role_update();

-- 관리자 권한 상승 완벽 차단 (트리거) 비활성화/활성화
-- ALTER TABLE public.profiles DISABLE TRIGGER trg_profiles_before_update_role;
-- ALTER TABLE public.profiles ENABLE TRIGGER trg_profiles_before_update_role;



-- 리스트 순서
-- 1. 회원가입 시 프로필 자동 생성 (트리거) : fn_trg_insert_profile
-- 2. 업데이트 시 자동 갱신 (트리거)       : fn_trg_set_updated_at
-- 7. 관리자 권한 상승 완벽 차단 (트리거)   : fn_trg_prevent_role_update

-- 3. 로그인 시 방문 횟수 증가 (RPC)     : increment_visit_count
-- 4. 회원 탈퇴 (Soft Delete) (RPC)  : soft_delete_account
-- 5. 프로필 이름 중복 확인 (RPC)       : is_full_name_available
-- 6. 내 계정 탈퇴 여부 확인 (RPC)      : is_my_account_deleted