-- 기존 visitor_environments 테이블에 ip_address 컬럼 추가
-- 테이블을 이미 만든 뒤 IP를 추가할 때 Supabase SQL 에디터에서 이 파일만 실행하세요.

ALTER TABLE public.visitor_environments
ADD COLUMN IF NOT EXISTS ip_address TEXT;

COMMENT ON COLUMN public.visitor_environments.ip_address IS '클라이언트 IP (개인정보 보관 시 주의)';
