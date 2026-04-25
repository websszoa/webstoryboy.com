"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  courseDocList,
  courseTitles,
  type CourseId,
} from "@/lib/tutorial/config";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface TutorialSidebarProps {
  course: CourseId;
}

function CourseTitle({ course, total }: { course: CourseId; total: number }) {
  return (
    <div className="px-4 pt-5 pb-4 border-b border-gray-100 dark:border-white/10">
      <span className="text-xs uppercase tracking-[0.3em] text-red-600 dark:text-dark-brand font-poppins">
        Tutorial
      </span>
      <p className="text-xl font-paperlogy text-slate-900 dark:text-white leading-snug">
        {courseTitles[course]}
      </p>
      <p className="text-[11px] text-muted-foreground font-poppins mt-1">
        {total} lessons
      </p>
    </div>
  );
}

function NavList({
  course,
  docs,
  pathname,
  onLinkClick,
}: {
  course: CourseId;
  docs: { slug: string; title: string; order: number }[];
  pathname: string;
  onLinkClick?: () => void;
}) {
  return (
    <nav aria-label="문서 목록">
      {docs.map((doc) => {
        const href = `/tutorial/${course}/${doc.slug}`;
        const isActive = pathname === href;
        return (
          <Link
            key={doc.slug}
            href={href}
            onClick={onLinkClick}
            className={cn(
              "flex items-start gap-2.5 px-4 pt-2 pb-1.5 text-sm transition-all font-anyvid",
              isActive
                ? "border-l-red-500 dark:border-l-dark-brand bg-red-50/60 dark:bg-dark-brand/5 text-red-600 dark:text-dark-brand"
                : "border-l-transparent text-muted-foreground hover:border-l-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white",
            )}
          >
            <span
              className={cn(
                "shrink-0 text-[10px] font-poppins leading-[1.8] w-4 text-right",
                isActive
                  ? "text-red-400 dark:text-dark-brand/70"
                  : "text-muted-foreground/40",
              )}
            >
              {String(doc.order).padStart(2, "0")}
            </span>
            <span className="leading-relaxed">{doc.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function TutorialSidebar({ course }: TutorialSidebarProps) {
  const pathname = usePathname();
  const docs = courseDocList[course] ?? [];

  return (
    <>
      {/* 데스크톱 사이드바 */}
      <aside className="sticky top-0 self-start hidden h-dvh w-58 shrink-0 overflow-hidden border-r border-gray-200 dark:border-white/10 md:flex md:flex-col">
        <CourseTitle course={course} total={docs.length} />
        <ScrollArea className="min-h-0 flex-1">
          <div className="py-2">
            <NavList course={course} docs={docs} pathname={pathname} />
          </div>
        </ScrollArea>
      </aside>

      {/* 모바일 사이드바 (Sheet) */}
      <div className="md:hidden fixed bottom-20 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="rounded-full shadow-lg bg-brand hover:bg-brand/90 text-white"
              aria-label="강의 목록 열기"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader>
              <SheetTitle className="sr-only">강의 목록</SheetTitle>
              <CourseTitle course={course} total={docs.length} />
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-7rem)]">
              <div className="py-2">
                <NavList course={course} docs={docs} pathname={pathname} />
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
