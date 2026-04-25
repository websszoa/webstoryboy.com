import { Resend } from "resend";
import { APP_NAME, APP_SITE_URL } from "@/lib/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "webstupids@gmail.com";

const PROVIDER_LABEL: Record<string, string> = {
  email: "이메일",
  google: "구글",
  kakao: "카카오",
  github: "깃허브",
};

export async function sendSignupNotify({
  email,
  displayName,
  provider = "email",
}: {
  email: string;
  displayName?: string;
  provider?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <onboarding@resend.dev>`,
      to: ADMIN_EMAIL,
      subject: `[${APP_NAME}] 새 회원 가입 알림`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 16px; color: #111827;">🎉 새 회원이 가입했습니다</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 80px;">이메일</td>
              <td style="padding: 8px 0; color: #111827;">${email}</td>
            </tr>
            ${
              displayName
                ? `<tr>
                     <td style="padding: 8px 0; color: #6b7280;">닉네임</td>
                     <td style="padding: 8px 0; color: #111827;">${displayName}</td>
                   </tr>`
                : ""
            }
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">가입 방법</td>
              <td style="padding: 8px 0; color: #111827;">${PROVIDER_LABEL[provider] ?? provider}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">가입 시각</td>
              <td style="padding: 8px 0; color: #111827;">${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
            <a href="${APP_SITE_URL}/admin/member" style="color: #f1170f; font-size: 13px; text-decoration: none;">→ 관리자 페이지에서 확인하기</a>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[sendSignupNotify] Resend 오류:", JSON.stringify(error));
    } else {
      console.log("[sendSignupNotify] 발송 성공 id:", data?.id);
    }
  } catch (error) {
    console.error("[sendSignupNotify] 예외:", error);
  }
}
