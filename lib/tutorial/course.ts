// 코스 메뉴 (main-site, main-banner 등에서 사용)
export const courseMenuItems = [
  {
    title: "웹디자인개발기능사",
    thumbnail: "/thumbnail/webdesign.jpg",
    site: "https://www.q-net.or.kr/",
    level: "입문",
    src: "/tutorial/webdesign",
    description:
      "레이아웃 A·B·C·D·E·F 유형과 스크립트(메뉴, 슬라이드, 탭, 팝업)를 단계별로 연습하는 실기 대비 강의입니다.",
    detailDescription:
      "웹디자인기능사 실기 시험 대비 튜토리얼입니다. 웹 표준과 시멘틱 마크업을 바탕으로 flex 레이아웃으로 A-1부터 F-4까지 24가지 레이아웃 유형을 단계별로 구현하고, 스크립트 메뉴(1~6·F-3), 이미지 슬라이드(페이드·좌우·세로·반응형), 탭 메뉴, 팝업까지 jQuery와 자바스크립트로 직접 작성해 봅니다. 총 39개의 실습 문서로 시험 유형을 체계적으로 익힐 수 있습니다.",
    skillCards: [
      {
        category: "frontend",
        icon: { src: "/svg/html5.svg", alt: "html5", width: 40, height: 40 },
        label: "HTML",
      },
      {
        category: "frontend",
        icon: { src: "/svg/css3.svg", alt: "css3", width: 40, height: 40 },
        label: "CSS",
      },
      {
        category: "frontend",
        icon: {
          src: "/svg/javascript.svg",
          alt: "javascript",
          width: 40,
          height: 40,
        },
        label: "JavaScript",
      },
      {
        category: "frontend",
        icon: { src: "/svg/jquery.svg", alt: "jquery", width: 40, height: 40 },
        label: "jQuery",
      },
    ],
    features: [
      {
        name: "레이아웃",
        description:
          " A·B·C·D·E·F 6가지 유형 24단계로 시험에 나오는 레이아웃을 flex로 구현",
      },
      {
        name: "스크립트 메뉴",
        description:
          " 1~6번, F-3 유형으로 드롭다운·서브메뉴 등 네비게이션 스크립트 연습",
      },
      {
        name: "이미지 슬라이드",
        description:
          " 페이드·좌우 무한·세로·반응형(background-image·vh) 등 6가지 유형 구현",
      },
      {
        name: "탭·팝업",
        description:
          " 탭 메뉴로 콘텐츠 전환, 팝업으로 표시/숨김 제어를 jQuery·자바스크립트로 연습",
      },
      {
        name: "실기 대비",
        description:
          " 시험 시간 안에 완성할 수 있도록 구조와 로직을 반복 연습할 수 있는 MDX 문서 구성",
      },
    ],
  },
];
