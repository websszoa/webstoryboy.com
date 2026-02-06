import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";

  // code가 있으면 로그인 처리 진행
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    // 교환 실패하면 홈으로 이동
    if (error) {
      console.error("exchangeCodeForSession 오류:", error.message);
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 로그인 성공 후: 탈퇴 계정인지 확인 (RPC)
    const { data: isDeleted, error: deletedError } = await supabase.rpc(
      "get_my_account_deleted",
    );

    // 탈퇴 체크 실패 시 안전하게 홈으로 이동
    if (deletedError) {
      console.error("탈퇴 여부 확인 오류:", deletedError.message);
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 탈퇴 계정이면 강제 로그아웃 후 홈으로 이동
    if (isDeleted === true) {
      await supabase.auth.signOut();
      const redirectUrl = new URL("/", request.url);
      redirectUrl.searchParams.set("error", "deleted_account");
      return NextResponse.redirect(redirectUrl);
    }

    // 정상 계정이면 방문 횟수 증가
    try {
      await supabase.rpc("increment_visit_count");
    } catch (rpcError) {
      console.error("방문 횟수 증가 오류:", rpcError);
    }

    // 로그인 성공 시 welcome=true 붙여서 next로 이동
    const redirectUrl = new URL(next, request.url);
    redirectUrl.searchParams.set("welcome", "true");
    return NextResponse.redirect(redirectUrl);
  }

  // code가 없으면 error=missing_code 붙여서 홈으로 이동
  const redirectUrl = new URL("/", request.url);
  redirectUrl.searchParams.set("error", "missing_code");
  return NextResponse.redirect(redirectUrl);
}
