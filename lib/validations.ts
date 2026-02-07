import { z } from "zod";

// 로그인 폼 스키마 정의
export const loginSchema = z.object({
  email: z
    .email("→ 올바른 이메일 형식이 아닙니다.")
    .min(1, "→ 이메일을 입력해주세요."),
  password: z
    .string()
    .min(1, "→ 비밀번호를 입력해주세요.")
    .min(8, "→ 비밀번호는 최소 8자 이상이어야 합니다.")
    .regex(/[A-Z]/, "→ 대문자를 최소 1개 이상 포함해야 합니다.")
    .regex(/[a-z]/, "→ 소문자를 최소 1개 이상 포함해야 합니다.")
    .regex(/[0-9]/, "→ 숫자를 최소 1개 이상 포함해야 합니다.")
    .regex(/[\W_]/, "→ 특수문자를 최소 1개 이상 포함해야 합니다."),
});

// 회원가입 폼 스키마 정의
export const signUpSchema = z
  .object({
    email: z
      .email("→ 올바른 이메일 형식이 아닙니다.")
      .min(1, "→ 이메일을 입력해주세요."),
    password: z
      .string()
      .min(1, "→ 비밀번호를 입력해주세요.")
      .min(8, "→ 비밀번호는 최소 8자 이상이어야 합니다.")
      .regex(/[A-Z]/, "→ 대문자를 최소 1개 이상 포함해야 합니다.")
      .regex(/[a-z]/, "→ 소문자를 최소 1개 이상 포함해야 합니다.")
      .regex(/[0-9]/, "→ 숫자를 최소 1개 이상 포함해야 합니다.")
      .regex(/[\W_]/, "→ 특수문자를 최소 1개 이상 포함해야 합니다."),
    repeatPassword: z.string().min(1, "→ 확인 비밀번호를 입력해주세요."),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "→ 비밀번호가 일치하지 않습니다.",
    path: ["repeatPassword"],
  });

// 비밀번호 찾기 폼 스키마 정의
export const forgotPasswordSchema = z.object({
  email: z
    .email("→ 올바른 이메일 형식이 아닙니다.")
    .min(1, "→ 이메일을 입력해주세요."),
});

// 비밀번호 변경 폼 스키마 정의
export const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(1, "→ 비밀번호를 입력해주세요.")
    .min(8, "→ 비밀번호는 최소 8자 이상이어야 합니다.")
    .regex(/[A-Z]/, "→ 대문자를 최소 1개 이상 포함해야 합니다.")
    .regex(/[a-z]/, "→ 소문자를 최소 1개 이상 포함해야 합니다.")
    .regex(/[0-9]/, "→ 숫자를 최소 1개 이상 포함해야 합니다.")
    .regex(/[\W_]/, "→ 특수문자를 최소 1개 이상 포함해야 합니다."),
});

// 프로필 이름 변경 폼 스키마
export const profileNameSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, "이름은 3자 이상 입력해주세요")
    .max(18, "이름은 18자 이내로 입력해주세요"),
});

// 관리자 로그인 폼 스키마
export const adminLoginSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

// 문의하기 폼 스키마
export const contactSchema = z.object({
  message: z
    .string()
    .min(10, "문의 내용을 10자 이상 입력해주세요")
    .max(1000, "문의 내용은 1000자 이내로 입력해주세요"),
});
