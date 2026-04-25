/**
 * 튜토리얼 코스별 문서 목록 (왼쪽 사이드바용)
 * slug는 content/tutorial/{course}/{slug}.mdx 파일명과 일치
 */
export const courseIds = ["runzoa", "webdesign"] as const;
export type CourseId = (typeof courseIds)[number];

export interface DocItem {
  slug: string;
  title: string;
  order: number;
}

export const courseDocList: Record<CourseId, DocItem[]> = {
  runzoa: [
    {
      slug: "getting-started-with-marathon",
      title: "마라톤을 시작하며...",
      order: 1,
    },
    { slug: "marathon-site-planning", title: "마라톤 사이트 기획", order: 2 },
  ],
  webdesign: [
    { slug: "01-layout-a1", title: "레이아웃 A-1", order: 1 },
    { slug: "02-layout-a2", title: "레이아웃 A-2", order: 2 },
    { slug: "03-layout-a3", title: "레이아웃 A-3", order: 3 },
    { slug: "04-layout-a4", title: "레이아웃 A-4", order: 4 },
    { slug: "05-layout-b1", title: "레이아웃 B-1", order: 5 },
    { slug: "06-layout-b2", title: "레이아웃 B-2", order: 6 },
    { slug: "07-layout-b3", title: "레이아웃 B-3", order: 7 },
    { slug: "08-layout-b4", title: "레이아웃 B-4", order: 8 },
    { slug: "09-layout-c1", title: "레이아웃 C-1", order: 9 },
    { slug: "10-layout-c2", title: "레이아웃 C-2", order: 10 },
    { slug: "11-layout-c3", title: "레이아웃 C-3", order: 11 },
    { slug: "12-layout-c4", title: "레이아웃 C-4", order: 12 },
    { slug: "13-layout-d1", title: "레이아웃 D-1", order: 13 },
    { slug: "14-layout-d2", title: "레이아웃 D-2", order: 14 },
    { slug: "15-layout-d3", title: "레이아웃 D-3", order: 15 },
    { slug: "16-layout-d4", title: "레이아웃 D-4", order: 16 },
    { slug: "17-layout-e1", title: "레이아웃 E-1", order: 17 },
    { slug: "18-layout-e2", title: "레이아웃 E-2", order: 18 },
    { slug: "19-layout-e3", title: "레이아웃 E-3", order: 19 },
    { slug: "20-layout-e4", title: "레이아웃 E-4", order: 20 },
    { slug: "21-layout-f1", title: "레이아웃 F-1", order: 21 },
    { slug: "22-layout-f2", title: "레이아웃 F-2", order: 22 },
    { slug: "23-layout-f3", title: "레이아웃 F-3", order: 23 },
    { slug: "24-layout-f4", title: "레이아웃 F-4", order: 24 },
    { slug: "25-script-menu", title: "스크립트 메뉴", order: 25 },
    { slug: "26-script-menu2", title: "스크립트 메뉴2", order: 26 },
    { slug: "27-script-menu3", title: "스크립트 메뉴3", order: 27 },
    { slug: "28-script-menu4", title: "스크립트 메뉴4", order: 28 },
    { slug: "29-script-menu5", title: "스크립트 메뉴5", order: 29 },
    { slug: "30-script-menu6", title: "스크립트 메뉴6", order: 30 },
    { slug: "31-script-menu-f3", title: "스크립트 메뉴 F-3", order: 31 },
    { slug: "32-script-slide1", title: "스크립트 슬라이드1", order: 32 },
    { slug: "33-script-slide2", title: "스크립트 슬라이드2", order: 33 },
    { slug: "34-script-slide3", title: "스크립트 슬라이드3", order: 34 },
    { slug: "35-script-slide4", title: "스크립트 슬라이드4", order: 35 },
    { slug: "36-script-slide5", title: "스크립트 슬라이드5", order: 36 },
    { slug: "37-script-slide6", title: "스크립트 슬라이드6", order: 37 },
    { slug: "38-script-tab", title: "스크립트 탭 메뉴", order: 38 },
    { slug: "39-script-popup", title: "스크립트 팝업", order: 39 },
  ],
};

export const courseTitles: Record<CourseId, string> = {
  runzoa: "마라톤 사이트 만들기",
  webdesign: "웹디자인개발기능사",
};
