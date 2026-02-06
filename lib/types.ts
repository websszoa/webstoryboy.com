import { z } from "zod";
import {
  loginSchema,
  signUpSchema,
  forgotPasswordSchema,
  updatePasswordSchema,
  profileNameSchema,
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

// profiles
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
