import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const code = request.nextUrl.searchParams.get("code");

  // OAuth 콜백이 루트(/?code=...)로 올 경우 /callback으로 넘겨서 세션 교환 처리
  if (pathname === "/" && code) {
    const url = request.nextUrl.clone();
    url.pathname = "/callback";
    return NextResponse.redirect(url);
  }

  // 기본 응답 객체 생성 (이 응답에 Supabase가 쿠키를 넣어줌)
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 서버에서 사용할 Supabase 클라이언트 생성 (SSR 전용)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 요청(request)에 들어있는 쿠키들을 Supabase가 읽을 수 있게 제공
        getAll() {
          return request.cookies.getAll();
        },

        // Supabase가 새로 설정해야 하는 쿠키들을 응답(response)에 넣어주는 부분
        // (세션 유지/갱신에 핵심)
        setAll(cookiesToSet) {
          // request 쿠키에도 반영 (서버 내부에서 상태 동기화)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          // 응답 객체를 새로 만들고
          supabaseResponse = NextResponse.next({
            request,
          });

          // Supabase가 준 쿠키를 응답에 저장
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // ⚠️ 중요:
  // createServerClient() 이후 ~ getClaims() 호출 전까지
  // 다른 코드를 넣으면 세션 쿠키 동기화가 꼬일 수 있음
  // -> 가끔 랜덤 로그아웃 현상이 발생할 수 있음

  // ⚠️ 중요:
  // getClaims()는 단순히 유저 정보만 가져오는 게 아니라
  // 서버에서 세션 쿠키를 정상 유지/갱신하는 역할도 함
  // -> 이걸 빼면 SSR에서 랜덤 로그아웃 발생 가능
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (
    !user &&
    pathname.startsWith("/admin") && // admin만 막기
    !pathname.startsWith("/admin/member")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // ⚠️ 중요:
  // 반드시 supabaseResponse 그대로 return 해야 함
  // (Supabase가 세션 유지용 쿠키를 응답에 심어두기 때문)
  // 만약 다른 NextResponse를 새로 만들어 return 하면 쿠키가 날아가서
  // 로그인 상태가 꼬이고 세션이 끊길 수 있음

  return supabaseResponse;
}
