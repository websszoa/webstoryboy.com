-- ============================================
-- 탈퇴 계정 여부 조회 (RLS 우회)
-- ============================================
CREATE OR REPLACE FUNCTION public.get_my_account_deleted()
RETURNS BOOLEAN
AS $$
  SELECT COALESCE((SELECT is_deleted FROM public.profiles WHERE id = auth.uid()), FALSE);
$$ 
LANGUAGE sql 
SECURITY DEFINER 
SET search_path = public;

-- 공개 실행 권한 제거
REVOKE EXECUTE ON FUNCTION public.get_my_account_deleted() FROM PUBLIC;
-- 로그인한 사용자만 실행 가능
GRANT EXECUTE ON FUNCTION public.get_my_account_deleted() TO authenticated;

-- ============================================
-- 로그인 시 방문 횟수 증가 함수 (visit_count + 1)
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_visit_count()
RETURNS VOID
AS $$
BEGIN
  UPDATE public.profiles
  SET
    visit_count = visit_count + 1
  WHERE id = auth.uid()
    AND is_deleted = FALSE;
END;
$$
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public; 

-- 공개 실행 권한 제거
REVOKE EXECUTE ON FUNCTION public.increment_visit_count() FROM PUBLIC;
-- 로그인한 사용자만 실행 가능
GRANT EXECUTE ON FUNCTION public.increment_visit_count() TO authenticated;

-- ============================================
-- 회원 탈퇴 함수 (Soft Delete)
-- ============================================
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS VOID 
AS $$
BEGIN
  UPDATE public.profiles
  SET
    is_deleted = TRUE,
    deleted_at = NOW()
  WHERE id = auth.uid();
END;
$$ 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public;

-- 공개 실행 권한 제거
REVOKE EXECUTE ON FUNCTION public.delete_user_account() FROM PUBLIC;
-- 로그인한 사용자만 실행 가능
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;