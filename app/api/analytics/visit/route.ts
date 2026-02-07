import { NextResponse } from "next/server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { parseUserAgent } from "@/lib/parse-user-agent";

const COUNTRY_NAMES: Record<string, string> = {
  KR: "대한민국",
  US: "United States",
  JP: "일본",
  CN: "China",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  IN: "India",
  BR: "Brazil",
  VN: "Vietnam",
  TH: "Thailand",
  TW: "Taiwan",
};

/** 요청에서 클라이언트 IP 추출 (Vercel: x-real-ip, 일반: x-forwarded-for 첫 값) */
function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first && first !== "::1") return first;
  }
  const real = request.headers.get("x-real-ip");
  if (real && real !== "::1") return real;
  return null;
}

/** IP로 국가/지역 조회 (ip-api.com 무료, 45회/분 제한) - Vercel 헤더 없을 때 사용 */
async function fetchGeoFromIp(ip: string): Promise<{
  country_code: string | null;
  country_name: string | null;
  region: string | null;
  city: string | null;
}> {
  if (!ip || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip === "::1") {
    return { country_code: null, country_name: null, region: null, city: null };
  }
  try {
    const res = await fetch(
      `https://ip-api.com/json/${encodeURIComponent(ip)}?fields=country,countryCode,regionName,city`,
      { next: { revalidate: 0 } },
    );
    if (!res.ok)
      return {
        country_code: null,
        country_name: null,
        region: null,
        city: null,
      };
    const data = (await res.json()) as {
      country?: string;
      countryCode?: string;
      regionName?: string;
      city?: string;
    };
    return {
      country_code: data.countryCode ?? null,
      country_name: data.country ?? null,
      region: data.regionName ?? null,
      city: data.city ?? null,
    };
  } catch {
    return { country_code: null, country_name: null, region: null, city: null };
  }
}

export async function POST(request: Request) {
  try {
    const userAgent = request.headers.get("user-agent") ?? null;
    const clientIp = getClientIp(request);

    let countryCode =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      null;
    let region = request.headers.get("x-vercel-ip-country-region") || null;
    let city = request.headers.get("x-vercel-ip-city") || null;

    let countryNameFromGeo: string | null = null;
    if (!countryCode && clientIp) {
      const geo = await fetchGeoFromIp(clientIp);
      countryCode = geo.country_code ?? null;
      countryNameFromGeo = geo.country_name ?? null;
      region = region || geo.region;
      city = city || geo.city;
    }

    let body: {
      language?: string;
      screen_width?: number;
      screen_height?: number;
      referrer_domain?: string;
    } = {};
    try {
      body = await request.json();
    } catch {
      // body 없어도 진행
    }

    const parsed = parseUserAgent(userAgent);
    const countryName =
      countryNameFromGeo ??
      (countryCode && COUNTRY_NAMES[countryCode.toUpperCase()]
        ? COUNTRY_NAMES[countryCode.toUpperCase()]
        : countryCode);

    let userId: string | null = null;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.id) userId = user.id;

    const adminSupabase = createServiceRoleClient();
    const { error } = await adminSupabase.from("visitor_environments").insert({
      user_id: userId,
      ip_address: clientIp,
      country_code: countryCode,
      country_name: countryName ?? countryCode ?? null,
      region: region || null,
      city: city || null,
      device_type: parsed.device_type,
      browser: parsed.browser,
      browser_version: parsed.browser_version,
      os: parsed.os,
      os_version: parsed.os_version,
      language: body.language ?? null,
      referrer_domain: body.referrer_domain || null,
      screen_width: body.screen_width ?? null,
      screen_height: body.screen_height ?? null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
