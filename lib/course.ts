// 코스 메뉴
export const courseMenuItems = [
  {
    title: "마라톤 사이트 만들기",
    thumbnail: "/thumbnail/marathon.png",
    site: "https://www.runzoa.com/",
    level: "중급~고급",
    src: "/tutorial/runzoa",
    description:
      "대회 데이터를 수집·정리하고 검색/필터·상세 페이지까지 갖춘 실전 마라톤 서비스를 구현합니다.",
    detailDescription:
      "실제 운영 중인 마라톤 정보 서비스를 처음부터 끝까지 구현하는 실전 프로젝트입니다. 웹 스크래핑을 통해 대회 데이터를 수집하고, Supabase로 체계적으로 관리하며, Next.js 16의 최신 기능을 활용해 검색·필터·정렬 기능이 완비된 사용자 친화적인 인터페이스를 구축합니다. 인증/권한 시스템을 통한 즐겨찾기와 댓글 기능까지 포함하여 확장 가능한 실무 수준의 웹 애플리케이션을 완성합니다.",
    skillCards: [
      {
        category: "framework",
        icon: {
          src: "/svg/nextjs.svg",
          alt: "nextjs",
          width: 40,
          height: 40,
        },
        label: "next.js 16",
      },
      {
        category: "database",
        icon: {
          src: "/svg/supabase.svg",
          alt: "supabase",
          width: 40,
          height: 40,
        },
        label: "supabase",
      },
      {
        category: "css",
        icon: {
          src: "/svg/tailwindcss.svg",
          alt: "tailwindcss",
          width: 40,
          height: 40,
        },
        label: "tailwindcss",
      },
      {
        category: "design",
        icon: {
          src: "/svg/shadcn.svg",
          alt: "shadcn",
          width: 40,
          height: 40,
        },
        label: "shadcn",
      },
      {
        category: "deploy",
        icon: {
          src: "/svg/vercel.svg",
          alt: "vercel",
          width: 40,
          height: 40,
        },
        label: "vercel",
      },
    ],
    features: [
      {
        name: "Next.js 16",
        description:
          " App Router를 활용한 서버 컴포넌트 기반 아키텍처로 성능 최적화된 페이지 구성",
      },
      {
        name: "Supabase",
        description:
          "를 통한 실시간 데이터베이스 관리와 RLS(Row Level Security) 기반 보안 정책 구현",
      },
      {
        name: "Tailwind CSS",
        description:
          "로 반응형 디자인을 구현하고 모바일부터 데스크톱까지 완벽한 사용자 경험 제공",
      },
      {
        name: "Shadcn/ui",
        description:
          " 컴포넌트 라이브러리를 활용하여 접근성과 사용성을 고려한 현대적인 UI 구성",
      },
      {
        name: "Vercel",
        description:
          " 플랫폼을 통한 자동 배포와 글로벌 CDN을 활용한 빠른 페이지 로딩 속도 구현",
      },
    ],
  },
  {
    title: "뮤직 사이트 만들기",
    thumbnail: "/thumbnail/music.png",
    site: "https://www.runzoa.com/",
    level: "중급~고급",
    src: "/tutorial/music",
    description:
      "플레이리스트·재생 UI·검색 기능을 중심으로 음악 서비스를 끝까지 완성해봅니다.",
    detailDescription:
      "현대적인 음악 스트리밍 서비스를 처음부터 끝까지 구현하는 실전 프로젝트입니다. React를 활용한 인터랙티브한 음악 재생 UI와 플레이리스트 관리 기능을 구현하고, Node.js 백엔드로 오디오 스트리밍과 실시간 검색 기능을 제공합니다. 사용자별 맞춤 플레이리스트 생성과 음악 추천 시스템까지 포함하여 실제 음악 서비스와 유사한 사용자 경험을 제공하는 웹 애플리케이션을 완성합니다.",
    skillCards: [
      {
        category: "framework",
        icon: { src: "/svg/react.svg", alt: "react", width: 40, height: 40 },
        label: "react",
      },
      {
        category: "backend",
        icon: {
          src: "/svg/nodejs.svg",
          alt: "nodejs",
          width: 40,
          height: 40,
        },
        label: "node.js",
      },
      {
        category: "database",
        icon: {
          src: "/svg/postgresql.svg",
          alt: "postgresql",
          width: 40,
          height: 40,
        },
        label: "postgresql",
      },
      {
        category: "css",
        icon: {
          src: "/svg/tailwindcss.svg",
          alt: "tailwindcss",
          width: 40,
          height: 40,
        },
        label: "tailwindcss",
      },
      {
        category: "deploy",
        icon: {
          src: "/svg/vercel.svg",
          alt: "vercel",
          width: 40,
          height: 40,
        },
        label: "vercel",
      },
    ],
    features: [
      {
        name: "React",
        description:
          " Hooks와 Context API를 활용한 상태 관리로 인터랙티브한 음악 재생 UI와 플레이리스트 기능 구현",
      },
      {
        name: "Node.js",
        description:
          " Express 프레임워크를 활용한 RESTful API 설계와 오디오 스트리밍 처리로 안정적인 백엔드 구축",
      },
      {
        name: "PostgreSQL",
        description:
          "을 통한 음악 메타데이터와 플레이리스트 데이터 관리 및 사용자 정보 저장",
      },
      {
        name: "Tailwind CSS",
        description:
          "로 반응형 디자인을 구현하고 모바일부터 데스크톱까지 완벽한 사용자 경험 제공",
      },
      {
        name: "Vercel",
        description:
          " 플랫폼을 통한 자동 배포와 글로벌 CDN을 활용한 빠른 페이지 로딩 속도 구현",
      },
    ],
  },
];
