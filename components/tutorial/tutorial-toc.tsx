"use client";

import type { TocItem } from "@/lib/tutorial/headings";
import { cn } from "@/lib/utils";

interface TutorialTocProps {
  headings: TocItem[];
}

export default function TutorialToc({ headings }: TutorialTocProps) {
  if (headings.length === 0) return null;

  return (
    <aside className="w-full shrink-0 md:w-52 lg:w-56">
      <div className="sticky top-6">
        <span className="font-paperlogy text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          On this page
        </span>
        <ul className="mt-3 space-y-2 border-l border-border pl-4">
          {headings.map((h) => (
            <li
              key={h.id}
              className={cn("font-anyvid text-sm", h.depth === 3 && "ml-2")}
            >
              <a
                href={`#${h.id}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
