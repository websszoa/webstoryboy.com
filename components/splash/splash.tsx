"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { APP_ENG_NAME } from "@/lib/constants";

const STORAGE_KEY = "splash:last_shown_date";
const KST_OFFSET_MIN = 9 * 60;
const SPLASH_DURATION_MS = 3000;
const SPLASH_FADE_OUT_MS = 400;
const SPLASH_CHAR_DELAY_MS = 100;

function getKSTDateString() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const kst = new Date(utcMs + KST_OFFSET_MIN * 60_000);
  return kst.toISOString().slice(0, 10);
}

export default function Splash() {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  // 하루 1번만 노출 체크 (오늘 처음이면 visible=true)
  useEffect(() => {
    const today = getKSTDateString();
    const lastShown = localStorage.getItem(STORAGE_KEY);

    if (lastShown !== today) {
      localStorage.setItem(STORAGE_KEY, today);
      setVisible(true);
    }
  }, []);

  // visible이 true일 때만 글자 애니메이션 카운트
  useEffect(() => {
    if (!visible) return;

    setVisibleCount(0);
    const id = setInterval(() => {
      setVisibleCount((n) => (n >= APP_ENG_NAME.length ? n : n + 1));
    }, SPLASH_CHAR_DELAY_MS);

    return () => clearInterval(id);
  }, [visible]);

  // visible이 true일 때만 페이드아웃/언마운트 타이머
  useEffect(() => {
    if (!visible) return;

    setFadeOut(false);

    const hideTimer = setTimeout(() => {
      setFadeOut(true);
    }, SPLASH_DURATION_MS);

    const unmountTimer = setTimeout(() => {
      setVisible(false);
    }, SPLASH_DURATION_MS + SPLASH_FADE_OUT_MS);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(unmountTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-99999 grid h-dvh w-full place-items-center bg-background transition-opacity ease-out",
        fadeOut ? "opacity-0" : "opacity-100",
      )}
      style={{ transitionDuration: `${SPLASH_FADE_OUT_MS}ms` }}
      aria-hidden="true"
    >
      <span className="font-poppins font-black uppercase tracking-tight text-brand text-4xl sm:text-5xl md:text-5xl md:mt-[-50px]">
        {APP_ENG_NAME}
      </span>
    </div>
  );
}
