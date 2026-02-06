export interface FAQ {
  id: number;
  title: string;
  content: string;
  category: "이용" | "결제" | "기술";
}

export const faqs: FAQ[] = [
  {
    id: 1,
    title: "웹스토리보이는 어떤 서비스인가요?",
    content:
      "웹스토리보이(WebStoryBoy)는 1인 개발자와 예비 개발자를 위한 실전 웹 개발 가이드 플랫폼입니다. Next.js, React, Supabase, Tailwind CSS 등 최신 웹 기술을 활용해 실제 서비스 제작 과정을 단계별로 쉽게 안내합니다.",
    category: "이용",
  },
  {
    id: 2,
    title: "웹스토리보이에서는 어떤 콘텐츠를 제공하나요?",
    content:
      "실제 프로젝트를 기반으로 한 웹 개발 튜토리얼, 서비스 아키텍처 설계, 인증·결제·배포 방법 등 1인 개발자가 바로 활용할 수 있는 실무 중심의 콘텐츠를 제공합니다.",
    category: "이용",
  },
  {
    id: 3,
    title: "초보 개발자도 이용할 수 있나요?",
    content:
      "네, 웹스토리보이는 개발 입문자부터 실무 경험이 있는 개발자까지 모두를 대상으로 합니다. 기본 개념 설명부터 실전 예제까지 단계적으로 구성되어 있어 혼자서도 충분히 따라올 수 있습니다.",
    category: "이용",
  },
  {
    id: 4,
    title: "유료 콘텐츠나 결제 서비스가 있나요?",
    content:
      "일부 프리미엄 콘텐츠 또는 실전 강의는 유료로 제공될 수 있습니다. 결제 관련 정보는 요금제 페이지에서 자세히 확인하실 수 있으며, 결제 전 충분한 안내를 제공합니다.",
    category: "결제",
  },
  {
    id: 5,
    title: "어떤 기술 스택을 다루나요?",
    content:
      "웹스토리보이는 Next.js(App Router), React, TypeScript, Supabase, Tailwind CSS, 인증(Auth), 데이터베이스 설계, 배포(Vercel) 등 최신 웹 개발 스택을 중심으로 다룹니다.",
    category: "기술",
  },
  {
    id: 6,
    title: "혼자 개발한 프로젝트를 실제 서비스로 만들 수 있나요?",
    content:
      "네, 웹스토리보이는 단순한 예제가 아닌 실제 서비스 런칭을 목표로 합니다. 기획부터 개발, 배포, 운영까지 1인 개발자가 겪는 전체 과정을 기준으로 가이드를 제공합니다.",
    category: "기술",
  },
];
