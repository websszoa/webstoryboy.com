import PageTitle from "@/components/page/page-title";
import { APP_NAME, APP_ENG_NAME } from "@/lib/constants";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = {
  title: `비밀번호 찾기 | ${APP_NAME}`,
  description: `${APP_ENG_NAME} 계정의 비밀번호를 재설정하려면 가입한 이메일을 입력해 주세요.`,
};

export default function Page() {
  return (
    <>
      <PageTitle
        subtitle="password"
        title="비밀번호 찾기"
        description="계정의 비밀번호를 재설정하려면 가입한 이메일을 입력해 주세요."
      />
      <ForgotPasswordForm />
    </>
  );
}
