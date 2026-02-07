"use client";

import { useEffect, useRef } from "react";

const SESSION_KEY = "visitor_env_sent";

export function VisitorCollector() {
  const sent = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || sent.current) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const language = navigator.language || undefined;
    const screen_width = window.screen?.width ?? undefined;
    const screen_height = window.screen?.height ?? undefined;
    let referrer_domain: string | undefined;
    try {
      if (document.referrer) {
        const url = new URL(document.referrer);
        referrer_domain = url.hostname;
      }
    } catch {
      // ignore
    }

    fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        screen_width,
        screen_height,
        referrer_domain,
      }),
    })
      .then(() => {
        sessionStorage.setItem(SESSION_KEY, "1");
      })
      .catch(() => {
        // silent fail
      });

    sent.current = true;
  }, []);

  return null;
}
