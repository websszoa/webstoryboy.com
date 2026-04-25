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
│   ├── callback-email/route.ts   # 이메일 인증·비밀번호 재설정 콜백
│   └── callback-sns/route.ts     # OAuth(구글/카카오/깃헙) 콜백
├── (root)/
│   ├── layout.tsx                # 메인 서비스 레이아웃
│   ├── about/page.tsx            # 소개
│   ├── notice/page.tsx           # 공지사항
│   ├── terms/page.tsx            # 이용약관
│   ├── privacy/page.tsx          # 개인정보처리방침
│   ├── profile/page.tsx          # 프로필
│   ├── favorites/page.tsx        # 즐겨찾기
│   └── contact/page.tsx          # 문의하기
├── admin/
│   ├── layout.tsx                # 관리자 레이아웃
│   ├── page.tsx                  # 관리자 대시보드
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
npm install react-hook-form zod @hookform/resolvers
npm install resend

npx shadcn@latest init                                 # shadcn/ui 초기화
npx shadcn@latest add button
npx shadcn@latest add sonner
npx shadcn@latest add tooltip
npx shadcn@latest add sheet
npx shadcn@latest add avatar
npx shadcn@latest add separator
npx shadcn@latest add badge
npx shadcn@latest add scroll-area
npx shadcn@latest add textarea
npx shadcn@latest add input
npx shadcn@latest add field
npx shadcn@latest add dialog
npx shadcn@latest add input-otp
npx shadcn@latest add checkbox
npx shadcn@latest add select
npx shadcn@latest add table
npx shadcn@latest add card
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sidebar
npx shadcn@latest add carousel
npx shadcn@latest add tabs
```

## 🛠 사용 도구 / 라이브러리

### 🧠 Built With

- Next.js 16 (App Router + React 19)
- TypeScript
- Supabase (인증 · DB)
- Vercel (배포)
- GitHub (저장소)
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

### 🍳 mdx

- next-mdx-remote — 서버에서 MDX 문자열을 컴포넌트로 렌더링 (RSC 지원).
- remark-gfm — GFM 테이블/취소선 등.
- rehype-slug — 헤딩에 id 부여 (오른쪽 TOC용).

```bash
npm install next-mdx-remote remark-gfm rehype-slug gray-matter
npm install github-slugger
npm install rehype-highlight
```

## 🔤 폰트 최적화

### 적용 내역

| 폰트                           | 처리 방법              | 전    | 후    | 절약  |
| ------------------------------ | ---------------------- | ----- | ----- | ----- |
| `anyvid.woff`                  | woff → woff2 변환      | 156KB | 114KB | 42KB  |
| `Paperlogy-Regular.woff2`      | 한국어 유니코드 서브셋 | 423KB | 132KB | 291KB |
| `NanumSquareNeo-Regular.woff2` | 한국어 유니코드 서브셋 | 393KB | 348KB | 45KB  |
| `Paperlogy-SemiBold.woff2`     | 미사용 → 삭제          | 425KB | -     | 425KB |
| `Paperlogy-Black.woff2`        | 미사용 → 삭제          | 431KB | -     | 431KB |

**총 1.23MB 절약**

### 서브셋팅 방법 (fonttools)

```bash
pip3 install fonttools brotli

pyftsubset 폰트파일.woff2 \
  --output-file=폰트파일.subset.woff2 \
  --flavor=woff2 \
  --unicodes="U+AC00-D7A3,U+1100-11FF,U+3130-318F,U+0020-007E,U+00A0-00FF,U+2019,U+201C,U+201D,U+2026,U+25CF"
```

| 유니코드 범위                 | 내용                       |
| ----------------------------- | -------------------------- |
| `U+AC00-D7A3`                 | 한글 완성형 11,172자       |
| `U+1100-11FF`                 | 한글 자모                  |
| `U+3130-318F`                 | 한글 호환 자모             |
| `U+0020-007E`                 | 영문 · 숫자 · 기호 (ASCII) |
| `U+00A0-00FF`                 | 라틴 확장 문자             |
| `U+2019,U+201C,U+201D,U+2026` | 따옴표 · 말줄임표          |
