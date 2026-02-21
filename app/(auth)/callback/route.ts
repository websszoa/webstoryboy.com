import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // 이동할 경로 (없으면 홈)
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    next = "/";
  }

  // Base URL 확정 로직 (성공/실패 리다이렉트 모두에 사용하기 위해 위로 올림)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  const baseUrl =
    !isLocalEnv && forwardedHost ? `https://${forwardedHost}` : origin;

  // code가 있으면 로그인 처리 진행
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 1. 탈퇴한 계정인지 확인
      const { data: isDeleted } = await supabase.rpc("is_my_account_deleted");
      if (isDeleted === true) {
        await supabase.auth.signOut();
        const deletedUrl = new URL("/", baseUrl);
        deletedUrl.searchParams.set("error", "deleted_account");
        return NextResponse.redirect(deletedUrl);
      }

      // 2. 방문 횟수 증가 (OAuth 재방문 시에만, 방금 가입한 경우는 프로필에 이미 1로 있으므로 제외)
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("created_at")
          .single();
        const createdAt = profile?.created_at
          ? new Date(profile.created_at).getTime()
          : 0;
        const isNewSignup = Date.now() - createdAt < 2 * 60 * 1000; // 2분 이내 생성
        if (!isNewSignup) {
          await supabase.rpc("increment_visit_count");
        }
      } catch (rpcError) {
        console.error("방문 횟수 증가 실패:", rpcError);
      }

      // 3. 로그인 성공 리다이렉트
      const redirectUrl = new URL(next, baseUrl);
      redirectUrl.searchParams.set("welcome", "true");
      redirectUrl.searchParams.set("provider", "oauth");
      return NextResponse.redirect(redirectUrl);
    }
  }

  // code가 없으면 로그인 실패 처리
  const failUrl = new URL("/", baseUrl);
  failUrl.searchParams.set("error", "error_code");
  failUrl.searchParams.set("provider", "oauth");
  return NextResponse.redirect(failUrl);
}
