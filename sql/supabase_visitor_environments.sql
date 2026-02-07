-- ============================================
-- 방문자 환경 수집 테이블
-- 나라, 지역, 디바이스·브라우저·OS 등 방문 환경 저장
-- ============================================

CREATE TABLE IF NOT EXISTS public.visitor_environments (
  id UUID NOT NULL DEFAULT gen_random_uuid(),

  -- 로그인한 경우에만 저장 (선택)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- 클라이언트 IP (선택, 개인정보 주의)
  ip_address TEXT,

  -- 지역 정보 (IP 기반 지오로케이션 또는 클라이언트 제공)
  country_code TEXT,        -- ISO 3166-1 alpha-2 (예: KR, US)
  country_name TEXT,        -- 예: South Korea, United States
  region TEXT,              -- 예: Seoul, California
  city TEXT,                -- 예: Gangnam-gu

  -- 사용 환경
  device_type TEXT,         -- mobile, desktop, tablet
  browser TEXT,             -- Chrome, Safari, Firefox, ...
  browser_version TEXT,
  os TEXT,                  -- Windows, macOS, iOS, Android, ...
  os_version TEXT,

  -- 기타
  language TEXT,            -- ko-KR, en-US (navigator.language)
  referrer_domain TEXT,     -- 유입 도메인 (직접 입력이면 null)
  screen_width INTEGER,     -- 화면 너비 (선택)
  screen_height INTEGER,    -- 화면 높이 (선택)

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (id)
);

-- 인덱스 (조회·집계용)
CREATE INDEX IF NOT EXISTS idx_visitor_environments_created_at
  ON public.visitor_environments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_environments_country_code
  ON public.visitor_environments(country_code);
CREATE INDEX IF NOT EXISTS idx_visitor_environments_region
  ON public.visitor_environments(region);
CREATE INDEX IF NOT EXISTS idx_visitor_environments_device_type
  ON public.visitor_environments(device_type);
CREATE INDEX IF NOT EXISTS idx_visitor_environments_user_id
  ON public.visitor_environments(user_id);

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE public.visitor_environments ENABLE ROW LEVEL SECURITY;

-- INSERT: anon/authenticated에서 직접 넣지 않음. API(서버)에서 service role로만 삽입 권장.
--         필요 시 아래 정책으로 'authenticated'만 insert 허용할 수 있음.
-- INSERT 정책 없음 = 클라이언트 직접 insert 불가. 백엔드(API)에서 createServiceRoleClient()로 삽입.

-- SELECT: 관리자만 전체 조회 가능 (profiles.role = 'admin'은 DB 내부 조인으로 확인)
DROP POLICY IF EXISTS "Admins can view visitor environments" ON public.visitor_environments;
CREATE POLICY "Admins can view visitor environments"
  ON public.visitor_environments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- UPDATE/DELETE: 통계 테이블이므로 일반적으로 수정·삭제 불가. 필요 시 관리자 전용 정책 추가 가능.

-- ============================================
-- 코멘트 (선택)
-- ============================================
COMMENT ON TABLE public.visitor_environments IS '사이트 방문자 환경: 국가/지역, 디바이스, 브라우저, OS 등';
COMMENT ON COLUMN public.visitor_environments.country_code IS 'ISO 3166-1 alpha-2 국가 코드';
COMMENT ON COLUMN public.visitor_environments.device_type IS 'mobile | desktop | tablet';
COMMENT ON COLUMN public.visitor_environments.referrer_domain IS '유입 도메인 (document.referrer 파싱)';
COMMENT ON COLUMN public.visitor_environments.ip_address IS '클라이언트 IP (개인정보 보관 시 주의)';

-- 이미 테이블을 만든 경우: sql/migration_visitor_environments_add_ip.sql 실행
