import {
  LucideIcon,
  Home,
  Newspaper,
  Rat,
  Grip,
  Handshake,
  Compass,
  Drama,
  Star,
  User,
  Gem,
  LogIn,
  Cable,
  Gamepad2,
  Lock,
  Globe,
} from "lucide-react";

export interface HeaderMenuItem {
  label: string;
  href: string;
}

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

export interface FooterColumnMenu {
  title: string;
  items: { label: string; href: string }[];
}

// 헤더 메뉴
export const headerMenuItems: HeaderMenuItem[] = [
  { label: "생성하기", href: "/" },
  { label: "갤러리", href: "/gallery" },
  { label: "요금제", href: "/price" },
  { label: "문의하기", href: "/contact" },
];

// 모바일 메뉴
export const mobileMenuItems: MenuItem[] = [
  { icon: Home, label: "홈", href: "/" },
  { icon: Newspaper, label: "갤러리", href: "/gallery" },
  { icon: Rat, label: "요금제", href: "/price" },
  { icon: Grip, label: "더보기", href: "#more" },
];

// 기본 메뉴
export const basicMenuItems: MenuItem[] = [
  { icon: Home, label: "홈", href: "/" },
  { icon: Newspaper, label: "공지사항", href: "/notice" },
  { icon: Rat, label: "문의하기", href: "/contact" },
  { icon: Compass, label: "이용약관", href: "/terms" },
  { icon: Drama, label: "개인정보취급방침", href: "/privacy" },
];

// 로그인 했을 때
export const userMenuItems: MenuItem[] = [
  { icon: User, label: "프로필", href: "/profile" },
  { icon: Star, label: "즐겨찾기", href: "/favorites" },
  { icon: Lock, label: "비밀번호 변경", href: "/forgot-password" },
  { icon: Gem, label: "관리자", href: "/admin" },
];

// 로그인 안 했을 때
export const guestMenuItems: MenuItem[] = [
  { icon: LogIn, label: "로그인", href: "/login" },
  { icon: Handshake, label: "회원가입", href: "/sign-up" },
  { icon: Lock, label: "비밀번호 찾기", href: "/forgot-password" },
  { icon: User, label: "내 정보", href: "/profile" },
];

// 관리자 메뉴
export const adminMenuItems: MenuItem[] = [
  { icon: Home, label: "대시보드", href: "/admin" },
  { icon: Cable, label: "회원 관리", href: "/admin/member" },
  { icon: Gamepad2, label: "문의하기", href: "/admin/contact" },
  { icon: Globe, label: "방문자 환경", href: "/admin/visitors" },
];

// 푸터 컬럼 메뉴
export const footerColumnMenus: FooterColumnMenu[] = [
  {
    title: "강의 정보",
    items: [
      { label: "튜토리얼 사이트 만들기", href: "/lecture/tutorial" },
      { label: "유튜브 사이트 만들기", href: "/lecture/youtube" },
    ],
  },
  {
    title: "바로가기",
    items: [
      { label: "런조아", href: "https://www.runzoa.com/" },
      { label: "이벤트조아", href: "https://www.eventzoa.com/" },
      { label: "칼로리조아", href: "https://www.kcalzoa.com/" },
      { label: "이미지조아", href: "https://www.imagezoa.com/" },
    ],
  },
  {
    title: "약관 및 정책",
    items: [
      { label: "이용약관", href: "/terms" },
      { label: "개인정보처리방침", href: "/privacy" },
    ],
  },
];
