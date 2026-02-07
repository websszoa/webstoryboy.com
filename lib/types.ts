import { z } from "zod";
import {
  loginSchema,
  signUpSchema,
  forgotPasswordSchema,
  updatePasswordSchema,
  profileNameSchema,
  adminLoginSchema,
  contactSchema,
} from "./validations";
import { LucideIcon } from "lucide-react";

// 로그인 폼 타입 정의
export type LoginFormValues = z.infer<typeof loginSchema>;

// 회원가입 폼 타입 정의
export type SignUpFormValues = z.infer<typeof signUpSchema>;

// 비밀번호 찾기 폼 타입 정의
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// 비밀번호 변경 폼 타입 정의
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

// 프로필 이름 변경 폼 타입
export type ProfileNameFormValues = z.infer<typeof profileNameSchema>;

// 관리자 로그인 폼 타입
export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

// 문의하기 폼 타입 (contact)
export type ContactFormValues = z.infer<typeof contactSchema>;

// page(page-profile)
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  visit_count: number;
  is_deleted: boolean;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

// admin(visitor_environments) 방문자 환경
export interface VisitorEnvironment {
  id: string;
  user_id: string | null;
  ip_address: string | null;
  country_code: string | null;
  country_name: string | null;
  region: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  browser_version: string | null;
  os: string | null;
  os_version: string | null;
  language: string | null;
  referrer_domain: string | null;
  screen_width: number | null;
  screen_height: number | null;
  created_at: string;
}

// admin(contacts) 문의 목록
export interface Contact {
  id: string;
  user_id: string;
  message: string;
  status: "pending" | "in_progress" | "resolved" | "closed";
  admin_reply: string | null;
  admin_id: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

// page(page-no-data)
export interface PageNoDataProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}
