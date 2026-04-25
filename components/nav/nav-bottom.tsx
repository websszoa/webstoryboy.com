"use client";

import Link from "next/link";
import { TentTree } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { mobileMenuItems } from "@/lib/menu";
import { useSheet } from "@/contexts/context-sheet";

export default function MobileNav() {
  const pathname = usePathname();
  const { setIsOpen } = useSheet();

  const handleMoreClick = (e: React.MouseEvent, href: string) => {
    if (href === "#more") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isMore = item.href === "#more";

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => isMore && handleMoreClick(e, item.href)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs transition-colors",
                  isActive
                    ? "text-brand dark:text-dark-brand"
                    : "text-muted-foreground hover:text-foreground dark:text-white/50 dark:hover:text-white",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-nanumNeo">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <nav className="pointer-events-none fixed right-0 bottom-4 left-0 z-30 hidden justify-center md:flex">
        <div className="pointer-events-auto flex items-center gap-5 rounded-full border bg-white/10 px-7 py-3 shadow-lg backdrop-blur-md">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="cursor-pointer"
            aria-label="연결 사이트 목록 열기"
          >
            <TentTree
              className="size-4.5 shrink-0 text-brand dark:text-dark-brand transition-transform hover:scale-110"
              aria-hidden
            />
          </button>
          <span className="h-4 w-px shrink-0 bg-gray-200" />
          {mobileMenuItems.map((item) => {
            const isActive = pathname === item.href;
            const isMore = item.href === "#more";

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => isMore && handleMoreClick(e, item.href)}
                className={cn(
                  "text-sm font-anyvid transition-colors",
                  isActive
                    ? "text-brand dark:text-dark-brand"
                    : "text-black/60 hover:text-black dark:text-white/50 dark:hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
