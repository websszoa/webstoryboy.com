## 튜토리얼 사이트 만들기

```
app/
├── (home)/
│   ├── layout.tsx                # 홈페이지 레이아웃
│   └── page.tsx                  # 홈페이지
├── (auth)/
│   ├── layout.tsx                # 인증 레이아웃
│   ├── login/page.tsx            # 로그인
│   ├── sign-up/page.tsx          # 회원가입
│   ├── sign-up-success/page.tsx  # 회원가입 완료
│   ├── forgot-password/page.tsx  # 비밀번호 찾기
│   ├── update-password/page.tsx  # 비밀번호 변경
│   ├── confirm/route.ts          # 이메일 인증 확인
│   └── callback/route.ts         # OAuth 콜백
├── (root)/
│   ├── layout.tsx                # 메인 서비스 레이아웃
│   ├── notice/page.tsx           # 공지사항
│   ├── terms/page.tsx            # 이용약관
│   ├── privacy/page.tsx          # 개인정보처리방침
│   ├── profile/page.tsx          # 프로필(마이페이지)
│   ├── favorites/page.tsx        # 즐겨찾기
│   └── contact/page.tsx          # 문의하기
├── admin/
│   ├── layout.tsx                # 관리자 레이아웃
│   ├── page.tsx                  # 관리자 대시보드
│   ├── visitors/page.tsx         # 방문자 관리
│   ├── member/page.tsx           # 회원 관리
│   └── contact/page.tsx          # 문의 관리
├── layout.tsx                    # 루트 레이아웃
├── globals.css                   # 전역 스타일
├── loading.tsx                   # 전역 로딩 UI
├── error.tsx                     # 전역 에러 바운더리
└── not-found.tsx                 # 404 페이지
```

## 🚀 Getting Started

### Next.js 프로젝트 생성

```bash
npx create-next-app@latest ./                          # Next.js 프로젝트 생성
npm install @supabase/supabase-js @supabase/ssr        # Supabase 클라이언트 & Supabase SSR 지원
npm install next-themes                                # 다크모드 테마 지원
npm install resend                                     # 메일보내기
npx shadcn@latest init                                 # shadcn/ui 초기화
npx shadcn@latest add button
npx shadcn@latest add sonner
npx shadcn@latest add sheet
npx shadcn@latest add scroll-area
npx shadcn@latest add separator
npx shadcn@latest add form
npx shadcn@latest add textarea
npx shadcn@latest add input
npx shadcn@latest add input-otp
npx shadcn@latest add checkbox
npx shadcn@latest add select
npx shadcn@latest add badge
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add avatar
npx shadcn@latest add card
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tooltip
npx shadcn@latest add sidebar
npx shadcn@latest add carousel
```

## 🛠 사용 도구 / 라이브러리

### 🧠 Built With

- Next.js 16 (App Router + React 19)
- TypeScript (정적 타입)
- Supabase (인증 · DB · Storage)
- Vercel (배포)
- GitHub (저장소 · CI/CD)
- Tailwind CSS + shadcn/ui (스타일 · UI 컴포넌트)
- lucide-react (아이콘)
- next-themes (다크/라이트 테마)
- react-hook-form + @hookform/resolvers + zod (폼 · 검증)
- Resend (이메일 발송)

### 📎 유용한 링크

- Next.js → https://nextjs.org/
- Supabase → https://supabase.com/
- Vercel → https://vercel.com/
- GitHub → https://github.com/
- Tailwind CSS → https://tailwindcss.com/
- shadcn/ui → https://ui.shadcn.com/
- Resend → https://resend.com/
