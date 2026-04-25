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
  signup_provider: string | null;
  role: string | null;
  visit_count: number;
  is_deleted: boolean;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

// admin(contacts) 문의 목록
export interface Contact {
  id: string;
  user_id: string;
  user_email: string;
  message: string;
  status: "pending" | "progress" | "resolved" | "closed";
  admin_reply: string | null;
  admin_id: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}
