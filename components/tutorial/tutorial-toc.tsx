"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThumbsUp, ThumbsDown, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/mdx";

interface TutorialTocProps {
  toc: TocItem[];
}

export default function TutorialToc({ toc }: TutorialTocProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);

  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 },
    );

    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <aside className="w-50 shrink-0 hidden lg:block" aria-label="목차">
      <div className="sticky top-6 flex flex-col gap-4">
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            목차
          </h3>
          <ul className="space-y-1.5 text-sm border-l border-gray-200">
            {toc.map((item) => (
              <li key={item.id}>
                <Link
                  href={`#${item.id}`}
                  className={cn(
                    "block py-0.5 transition-colors border-l-2 -ml-px",
                    item.depth === 3 ? "pl-5" : "pl-3",
                    activeId === item.id
                      ? "border-brand text-brand dark:text-dark-brand dark:border-dark-brand"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-400",
                  )}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 팁 박스 */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/5 p-3.5">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-base text-amber-600 dark:text-amber-400 uppercase tracking-wider font-poppins font-semibold">
              Tip
            </span>
          </div>
          <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-300/80 font-anyvid">
            막히는 부분은 토론방에서 함께 해결해 나가요!
          </p>
        </div>

        {/* 피드백 버튼 */}
        <div className="rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] p-3.5">
          <p className="text-sm text-muted-foreground font-anyvid mb-3 text-center">
            이 강의가 도움이 됐나요?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setFeedback(feedback === "good" ? null : "good")}
              className={cn(
                "flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-md border text-[11px] font-nanumNeo transition-all",
                feedback === "good"
                  ? "border-brand bg-brand/10 text-brand dark:border-dark-brand dark:bg-dark-brand/10 dark:text-dark-brand"
                  : "border-gray-200 dark:border-white/10 text-muted-foreground hover:border-brand/50 hover:text-brand dark:hover:border-dark-brand/50 dark:hover:text-dark-brand",
              )}
              aria-pressed={feedback === "good"}
            >
              <ThumbsUp
                className={cn(
                  "w-4 h-4 transition-transform",
                  feedback === "good" && "scale-110",
                )}
              />
              좋아요!
            </button>
            <button
              onClick={() => setFeedback(feedback === "bad" ? null : "bad")}
              className={cn(
                "flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-md border text-[11px] font-nanumNeo transition-all",
                feedback === "bad"
                  ? "border-slate-500 bg-slate-100 text-slate-700 dark:border-slate-400 dark:bg-slate-500/10 dark:text-slate-300"
                  : "border-gray-200 dark:border-white/10 text-muted-foreground hover:border-slate-400 hover:text-slate-600 dark:hover:border-slate-500 dark:hover:text-slate-400",
              )}
              aria-pressed={feedback === "bad"}
            >
              <ThumbsDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  feedback === "bad" && "scale-110",
                )}
              />
              아쉬어요!
            </button>
          </div>
          {feedback && (
            <p className="text-sm text-center text-muted-foreground mt-2 font-anyvid">
              {feedback === "good"
                ? "감사합니다! 😊"
                : "더 나은 강의로 보답할게요! 🙏"}
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
