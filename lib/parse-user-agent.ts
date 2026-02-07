/**
 * User-Agent 문자열에서 browser, os, device_type 추출 (간단한 파싱)
 */
export function parseUserAgent(ua: string | null): {
  browser: string | null;
  browser_version: string | null;
  os: string | null;
  os_version: string | null;
  device_type: string | null;
} {
  if (!ua || typeof ua !== "string") {
    return {
      browser: null,
      browser_version: null,
      os: null,
      os_version: null,
      device_type: null,
    };
  }

  let device_type: string | null = "desktop";
  if (
    /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      ua,
    )
  ) {
    device_type = /iPad|Tablet|PlayBook|Silk/i.test(ua) ? "tablet" : "mobile";
  }

  let browser: string | null = null;
  let browser_version: string | null = null;
  const browserMatch =
    ua.match(/(Chrome|Safari|Firefox|Edge|Opera|MSIE|Trident)\/[\d.]+/i) ||
    ua.match(/(Chrome|Safari|Firefox|Edge|Opera|MSIE)[\s/][\d.]+/i);
  if (browserMatch) {
    const parts = browserMatch[0].split(/[/\s]/);
    browser = parts[0].replace("Trident", "IE").replace("MSIE", "IE");
    browser_version = parts[1] ?? null;
  }
  if (!browser && /SamsungBrowser/i.test(ua)) {
    browser = "Samsung Browser";
  }

  let os: string | null = null;
  let os_version: string | null = null;
  if (/Windows NT 10/i.test(ua)) {
    os = "Windows";
    os_version = "10+";
  } else if (/Windows/i.test(ua)) {
    os = "Windows";
  } else if (/Mac OS X/i.test(ua)) {
    os = "macOS";
    const m = ua.match(/Mac OS X (\d+[._]\d+)/i);
    if (m) os_version = m[1].replace("_", ".");
  } else if (/iPhone OS|iOS/i.test(ua)) {
    os = "iOS";
    const m = ua.match(/OS (\d+[._]\d+)/i);
    if (m) os_version = m[1].replace("_", ".");
  } else if (/Android/i.test(ua)) {
    os = "Android";
    const m = ua.match(/Android (\d+[.\d]*)/i);
    if (m) os_version = m[1];
  } else if (/Linux/i.test(ua)) {
    os = "Linux";
  }

  return {
    browser,
    browser_version,
    os,
    os_version,
    device_type,
  };
}
