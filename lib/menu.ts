import {
  LucideIcon,
  Home,
  Newspaper,
  BadgeDollarSign,
  Grip,
  Handshake,
  Compass,
  Drama,
  Star,
  User,
  MessageCircle,
  Gem,
  LogIn,
  Cable,
  Gamepad2,
  HandHeart,
  Lock,
} from "lucide-react";

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

export interface FooterColumnMenu {
  title: string;
  items: { label: string; href: string }[];
}

// 모바일 메뉴
export const mobileMenuItems: MenuItem[] = [
  { icon: Home, label: "홈", href: "/" },
  { icon: Newspaper, label: "강의", href: "/tutorial" },
  { icon: BadgeDollarSign, label: "흔적", href: "/trace" },
  { icon: Grip, label: "더보기", href: "#more" },
];

// 기본 메뉴
export const basicMenuItems: MenuItem[] = [
  { icon: Home, label: "홈", href: "/" },
  { icon: Newspaper, label: "공지사항", href: "/notice" },
  { icon: MessageCircle, label: "문의하기", href: "/contact" },
  { icon: Compass, label: "이용약관", href: "/terms" },
  { icon: Drama, label: "개인정보취급방침", href: "/privacy" },
];

// 로그인 했을 때
export const userMenuItems: MenuItem[] = [
  { icon: User, label: "프로필", href: "/profile" },
  { icon: Star, label: "흔적", href: "/trace" },
  { icon: Lock, label: "비밀번호 변경", href: "/forgot-password" },
  { icon: Gem, label: "관리자", href: "/admin" },
];

// 로그인 안 했을 때
export const guestMenuItems: MenuItem[] = [
  { icon: LogIn, label: "로그인", href: "/login" },
  { icon: Handshake, label: "회원가입", href: "/sign-up" },
  { icon: Lock, label: "비밀번호 찾기", href: "/forgot-password" },
  { icon: User, label: "프로필", href: "/profile" },
];

// 관리자 메뉴
export const adminMenuItems: MenuItem[] = [
  { icon: Home, label: "대시보드", href: "/admin" },
  { icon: Cable, label: "회원 관리", href: "/admin/member" },
  { icon: Gamepad2, label: "문의하기", href: "/admin/contact" },
];

// 푸터 메뉴
export const footerMenuItems: MenuItem[] = [
  { icon: HandHeart, label: "소개", href: "/about" },
  { icon: MessageCircle, label: "문의사항", href: "/contact" },
  { icon: Compass, label: "이용약관", href: "/terms" },
  { icon: Drama, label: "개인정보취급방침", href: "/privacy" },
];
