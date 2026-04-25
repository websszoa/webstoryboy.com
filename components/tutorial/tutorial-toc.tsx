"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThumbsUp, ThumbsDown, Lightbulb, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/mdx";

interface TutorialTocProps {
  toc: TocItem[];
  course: string;
}

export default function TutorialToc({ toc, course }: TutorialTocProps) {
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
    <aside className="w-[240px] shrink-0 hidden lg:block" aria-label="목차">
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
        <div className="overflow-hidden rounded-lg border border-red-200 bg-linear-to-br from-red-50/80 via-white to-gray-50 dark:border-white/10 dark:from-white/[0.07] dark:via-white/[0.03] dark:to-transparent">
          <div className="px-3.5 py-3">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white/90 px-2 py-1 dark:border-dark-brand/30 dark:bg-white/5">
              <Lightbulb className="h-3.5 w-3.5 shrink-0 text-brand dark:text-dark-brand" />
              <span className="text-[11px] font-poppins font-semibold uppercase tracking-[0.24em] text-brand dark:text-dark-brand">
                Tip Box
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground dark:text-gray-200 font-anyvid mb-2">
              막히는 부분은 혼자 넘기지 말고 토론방에서 바로 질문해보세요.
            </p>
            <Link
              href={`/tutorial/${course}/discussion`}
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded bg-brand px-3.5 py-2 text-white transition-all hover:-translate-y-0.5 hover:bg-red-600"
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span className="text-sm font-anyvid">토론방 바로가기</span>
            </Link>
          </div>
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
