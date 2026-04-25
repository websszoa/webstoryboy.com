import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { APP_SITE_URL } from "@/lib/constants";
import { sendSignupNotify } from "@/lib/email";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // 이동할 경로 (없으면 홈)
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) next = "/";

  // Base URL 확정 (성공/실패 리다이렉트 공통 사용)
  // 서버 배포 시 request.url의 origin이 내부 주소(localhost 등)로 올 수 있어, 프로덕션에서는 고정 사이트 URL 사용
  const isLocalEnv = process.env.NODE_ENV === "development";
  const baseUrl = isLocalEnv
    ? origin
    : (process.env.NEXT_PUBLIC_SITE_URL ?? APP_SITE_URL);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error(
        "[callback-sns] exchangeCodeForSession 실패:",
        error.message,
        error,
      );
    }

    if (!error) {
      // 1. 탈퇴한 계정인지 확인
      const { data: isDeleted } = await supabase.rpc("is_my_account_deleted");
      if (isDeleted === true) {
        await supabase.auth.signOut();
        const url = new URL("/", baseUrl);
        url.searchParams.set("error", "deleted_account");
        return NextResponse.redirect(url);
      }

      // 2. 방문 횟수 증가
      try {
        await supabase.rpc("increment_visit_count");
      } catch (rpcError) {
        console.error("방문 횟수 증가 실패:", rpcError);
      }

      // 3. 신규 소셜 가입 알림 이메일 (가입 후 1분 이내인 경우만)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email && user.created_at) {
        const isNewUser =
          Date.now() - new Date(user.created_at).getTime() < 60_000;
        if (isNewUser) {
          await sendSignupNotify({
            email: user.email,
            displayName:
              user.user_metadata?.full_name ?? user.user_metadata?.name,
            provider: user.app_metadata?.provider ?? "sns",
          });
        }
      }

      // 4. 로그인 성공 리다이렉트
      const url = new URL(next, baseUrl);
      url.searchParams.set("welcome", "true");
      return NextResponse.redirect(url);
    }
  }

  // code 없음 또는 세션 교환 실패
  const failUrl = new URL("/", baseUrl);
  failUrl.searchParams.set("error", "error_code");
  return NextResponse.redirect(failUrl);
}
