import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@resend.dev";
const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL ?? "webstupids@gmail.com";
const SITE_NAME = "webstoryboy";

const PROVIDER_LABEL: Record<string, string> = {
  email: "이메일",
  google: "구글",
  kakao: "카카오",
  github: "깃허브",
};

function formatDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

export async function sendSignupNotify({
  email,
  displayName,
  provider = "email",
}: {
  email: string;
  displayName?: string;
  provider?: string;
}) {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const subject = `[${SITE_NAME}] ${formatDate(now)} 새로운 회원 가입`;

  try {
    const { data, error } = await resend.emails.send({
      from: `${SITE_NAME} <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 16px; color: #111827;">새 회원이 가입했습니다</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 80px;">이메일</td>
              <td style="padding: 8px 0; color: #111827;">${email}</td>
            </tr>
            ${displayName ? `<tr><td style="padding: 8px 0; color: #6b7280;">닉네임</td><td style="padding: 8px 0; color: #111827;">${displayName}</td></tr>` : ""}
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">가입 방법</td>
              <td style="padding: 8px 0; color: #111827;">${PROVIDER_LABEL[provider] ?? provider}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">가입 시각</td>
              <td style="padding: 8px 0; color: #111827;">${formatDate(now)}</td>
            </tr>
          </table>
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

export async function sendInquiryNotify({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const subject = `[${SITE_NAME}] ${formatDate(now)} 새로운 문의 등록`;

  try {
    const { data, error } = await resend.emails.send({
      from: `${SITE_NAME} <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 16px; color: #111827;">새 문의가 등록됐습니다</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 80px;">이름</td>
              <td style="padding: 8px 0; color: #111827;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">이메일</td>
              <td style="padding: 8px 0; color: #111827;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">문의 내용</td>
              <td style="padding: 8px 0; color: #111827; white-space: pre-wrap;">${message}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">등록 시각</td>
              <td style="padding: 8px 0; color: #111827;">${formatDate(now)}</td>
            </tr>
          </table>
        </div>
      `,
    });

    if (error) {
      console.error("[sendInquiryNotify] Resend 오류:", JSON.stringify(error));
    } else {
      console.log("[sendInquiryNotify] 발송 성공 id:", data?.id);
    }
  } catch (error) {
    console.error("[sendInquiryNotify] 예외:", error);
  }
}
