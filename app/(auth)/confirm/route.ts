import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // 이메일 인증 후 이동할 경로(next) (없으면 홈 "/")
  const _next = searchParams.get("next");

  // 보안 처리 : "/"로 시작하는 내부 경로만 허용
  const next = _next?.startsWith("/") ? _next : "/";

  // 이메일 인증 처리
  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    const redirectUrl = new URL(next, request.url);

    if (!error) {
      // 1. 탈퇴한 계정인지 확인
      const { data: isDeleted } = await supabase.rpc("is_my_account_deleted");

      if (isDeleted === true) {
        await supabase.auth.signOut();

        const errorUrl = new URL("/login", request.url);
        errorUrl.searchParams.set("error", "deleted_account");

        redirect(errorUrl.toString());
      }

      // 2. 비밀번호 재설정(recovery) → 새 비밀번호 입력 페이지로
      if (type === "recovery") {
        const updatePasswordUrl = new URL("/update-password", request.url);
        updatePasswordUrl.searchParams.set("verified", "true");
        redirect(updatePasswordUrl.toString());
      }

      // 3. 방문 횟수 증가 (회원가입/이메일 인증 등)
      try {
        await supabase.rpc("increment_visit_count");
      } catch (rpcError) {
        console.error("방문 횟수 증가 실패:", rpcError);
      }

      // 4. 성공 파라미터 추가
      redirectUrl.searchParams.set("welcome", "true");
    } else {
      redirectUrl.searchParams.set("error", "confirm_error");
    }

    redirect(redirectUrl.toString());
  }

  // token_hash 또는 type 없음 (잘못된/만료된 링크)
  const redirectUrl = new URL(next, request.url);
  redirectUrl.searchParams.set("error", "missing_token");
  redirect(redirectUrl.toString());
}
