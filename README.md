## 튜토리얼 사이트 만들기

```
app/
├── layout.tsx              # 루트 레이아웃
├── page.tsx                # 홈페이지
├── globals.css             # 전역 스타일
```

## 🚀 Getting Started

### Next.js 프로젝트 생성

```bash
npx create-next-app@latest ./                          # Next.js 프로젝트 생성
npm install @supabase/supabase-js @supabase/ssr        # Supabase 클라이언트 & Supabase SSR 지원
npm install next-themes                                # 다크모드 테마 지원
npx shadcn@latest init                                 # shadcn/ui 초기화
npx shadcn@latest add button
npx shadcn@latest add sonner
npx shadcn@latest add sheet
npx shadcn@latest add scroll-area
npx shadcn@latest add separator
npx shadcn@latest add form
npx shadcn@latest add textarea
npx shadcn@latest add input
npx shadcn@latest add badge
npx shadcn@latest add cheackbox
npx shadcn@latest add sidebar
npx shadcn@latest add input-otp
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add avatar
npx shadcn@latest add select
npx shadcn@latest add card
```

## 📝 회원가입 절차

이메일과 비밀번호를 통한 회원가입 및 이메일 인증 프로세스입니다.

```
─────────────────────────────────────────────────────────────────
  1. 회원가입 폼 작성
     sign-up-form.tsx
     → supabase.auth.signUp({ email, password, options })
     Zod 검증: 이메일 형식, 비밀번호 8자+ (대/소문자, 숫자, 특수문자)
     비밀번호 확인 일치 검증
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  2. 메타데이터 자동 설정
     display_name: 이메일 아이디 + 랜덤 4자리 (예: user1234)
     avatar_url: getRandomFaceImage()로 랜덤 아바타 이미지
     → options.data에 포함하여 Supabase 사용자 메타데이터에 저장
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  3. Supabase API로 회원가입 요청
     https://[PROJECT].supabase.co/auth/v1/signup
     이메일 중복 시: identities.length === 0 → "이미 회원가입된 이메일" 에러
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  4. 인증 이메일 발송
     Supabase가 가입 이메일로 인증 링크 자동 발송
     emailRedirectTo: / (인증 후 메인으로 이동 경로)
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  5. 회원가입 완료 페이지
     router.push("/sign-up-success")
     → 이메일 확인 안내, 스팸함 확인 등 안내 메시지 표시
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  6. 사용자 이메일에서 인증 링크 클릭
     → /confirm?token_hash=xxx&type=signup&next=/ 로 이동
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  7. 이메일 인증 콜백 처리 (confirm/route.ts)
     → supabase.auth.verifyOtp({ type, token_hash }) 토큰 검증
     → 성공 시 세션 쿠키 저장, next(/) 경로로 리다이렉트
     → 실패 시 /auth/error?error=xxx 로 이동
─────────────────────────────────────────────────────────────────
                              ▼
─────────────────────────────────────────────────────────────────
  8. 회원가입 완료
     계정 활성화 완료, 로그인 상태로 전환
     이름·아바타는 내 정보에서 수정 가능
─────────────────────────────────────────────────────────────────
```

## 🔐 인증 상태 조회 (getSession / getUser / getClaims)

헤더 등에서 **로그인 유무**를 표시할 때 Supabase에서 제공하는 메서드 비교입니다.

| 메서드           | 반환 내용                                | 용도                                                    |
| ---------------- | ---------------------------------------- | ------------------------------------------------------- |
| **getUser()**    | `user`만 (id, email, user_metadata 등)   | **로그인 여부·프로필 표시**에 적합. 토큰 없음, 가벼움.  |
| **getSession()** | `user` + `access_token`, `refresh_token` | API 호출에 토큰이 필요할 때. UI용으로는 과함.           |
| **getClaims()**  | JWT claims (커스텀 클레임 등)            | 권한·커스텀 클레임 확인용. 단순 로그인 여부에는 불필요. |
