import { APP_NAME, APP_ENG_NAME } from "@/lib/constants";
import PageTitle from "@/components/page/page-title";
import PageAbout from "@/components/page/page-about";

export const metadata = {
  title: `${APP_NAME} 소개 | ${APP_ENG_NAME} About`,
  description: `${APP_NAME}는 웹 개발과 디자인을 배우고 성장할 수 있도록 다양한 튜토리얼과 실전 제작 과정을 공유하는 웹스토리보이 튜토리얼 플랫폼입니다.`,
};

export default async function AboutPage() {
  return (
    <>
      <PageTitle
        subtitle="About"
        title="사이트 소개"
        description="웹 개발과 디자인을 배우는 사람들을 위한 실전 중심 튜토리얼 플랫폼입니다."
      />
      <PageAbout />
    </>
  );
}
