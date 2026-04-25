import { APP_NAME, APP_ENG_NAME } from "@/lib/constants";
import PageTitle from "@/components/page/page-title";
import PageTrace from "@/components/page/page-trace";

export const metadata = {
  title: `나의 흔적 | ${APP_ENG_NAME}`,
  description: `${APP_NAME}가 걸어온 개발의 흔적들을 모아둔 공간입니다.`,
};

export default function TracePage() {
  return (
    <>
      <PageTitle
        subtitle="Trace"
        title="나의 흔적"
        description="지금까지 만들고 기록해온 개발의 흔적들입니다."
      />
      <PageTrace />
    </>
  );
}
