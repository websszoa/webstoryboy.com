import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** KST 기준 오늘 날짜 문자열 (YYYY-MM-DD). 서버/클라이언트 공용. */
export function getKSTDateString(): string {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const kst = new Date(utcMs + 9 * 60 * 60_000);
  return kst.toISOString().slice(0, 10);
}

/** 이미지 랜덤 경로 반환 */
export function getRandomFaceImage(): string {
  const num = Math.floor(Math.random() * 10) + 1;
  const name = num < 10 ? `face0${num}` : `face${num}`;
  return `/face/${name}.png`;
}

/** ISO 날짜 문자열을 "YYYY-MM-DD" 형식으로 변환합니다. */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/** Supabase 에러 메시지를 한글로 변환 */
export function translateError(message: string | null | undefined): string {
  if (!message) return "알 수 없는 오류가 발생했습니다.";

  const errorMap: Record<string, string> = {
    // 로그인 관련
    "Invalid login credentials": "로그인 정보가 올바르지 않습니다.",
    "Email not confirmed": "이메일 인증이 완료되지 않았습니다.",
    "Invalid email or password": "이메일 또는 비밀번호가 올바르지 않습니다.",

    // 회원가입 관련
    "User already registered": "이미 등록된 사용자입니다.",
    "Email link is invalid or has expired":
      "이메일 인증 링크가 올바르지 않거나 만료되었습니다.",
    "Email rate limit exceeded":
      "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
    "Signup disabled": "회원가입이 비활성화되어 있습니다.",

    // 비밀번호 변경 관련
    "New password should be different from the old password.":
      "새 비밀번호는 기존 비밀번호와 달라야 합니다.",
  };

  // 정확한 매칭
  if (errorMap[message]) {
    return errorMap[message];
  }

  // 부분 매칭 (메시지에 키워드가 포함된 경우)
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // 매칭되지 않으면 원본 메시지 반환
  return message;
}
