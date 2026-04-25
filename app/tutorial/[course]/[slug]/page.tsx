import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { loadMdx, mdxRemoteOptions } from "@/lib/mdx";
import { PreWithCopy } from "@/components/tutorial/tutorial-code-block";
import {
  courseDocList,
  courseIds,
  courseTitles,
  type CourseId,
} from "@/lib/tutorial/config";

import TutorialToc from "@/components/tutorial/tutorial-toc";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string; slug: string }>;
}): Promise<Metadata> {
  const { course, slug } = await params;
  if (!courseIds.includes(course as CourseId)) return {};
  const doc = await loadMdx(course as CourseId, slug);
  if (!doc) return {};
  const title = (doc.frontmatter.title as string) ?? slug;
  const description = (doc.frontmatter.description as string) ?? undefined;
  const keywords = doc.frontmatter.keywords as string[] | string | undefined;
  const courseTitle = courseTitles[course as CourseId];
  return {
    title: `${title} | ${courseTitle}`,
    description: description ?? undefined,
    keywords: Array.isArray(keywords) ? keywords.join(", ") : keywords,
  };
}

export function generateStaticParams() {
  const params: { course: string; slug: string }[] = [];
  for (const course of courseIds) {
    const docs = courseDocList[course];
    for (const doc of docs) {
      params.push({ course, slug: doc.slug });
    }
  }
  return params;
}

interface TutorialDocPageProps {
  params: Promise<{ course: string; slug: string }>;
}

export default async function TutorialDocPage({
  params,
}: TutorialDocPageProps) {
  const { course, slug } = await params;
  if (!courseIds.includes(course as CourseId)) notFound();

  const doc = await loadMdx(course as CourseId, slug);
  if (!doc) notFound();

  const docs = courseDocList[course as CourseId];
  const currentIndex = docs.findIndex((d) => d.slug === slug);
  const prevDoc = currentIndex > 0 ? docs[currentIndex - 1] : null;
  const nextDoc =
    currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null;
  return (
    <div className="flex gap-8 p-4 md:p-6 px-0 lg:px-10 lg:pr-0">
      <article className="min-w-0 flex-1 py-0">
        <div className="tutorial-prose">
          <Suspense
            fallback={
              <div className="animate-pulse text-muted-foreground">
                로딩 중...
              </div>
            }
          >
            <MDXRemote
              source={doc.raw}
              options={mdxRemoteOptions}
              components={{ pre: PreWithCopy }}
            />
          </Suspense>
        </div>

        {/* 이전 / 다음 네비게이션 */}
        <nav
          className="mt-12 pt-6 border-t flex items-center gap-3"
          aria-label="이전 다음 강의"
        >
          {prevDoc ? (
            <Link
              href={`/tutorial/${course}/${prevDoc.slug}`}
              className="flex-1 flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm hover:shadow-md hover:border-red-500 transition-shadow group"
            >
              <ChevronLeft className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-red-500 transition-colors" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">이전</p>
                <p className="font-medium truncate">{prevDoc.title}</p>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextDoc ? (
            <Link
              href={`/tutorial/${course}/${nextDoc.slug}`}
              className="flex-1 flex items-center justify-end gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm hover:shadow-md hover:border-red-500 transition-shadow group text-right"
            >
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">다음</p>
                <p className="font-medium truncate">{nextDoc.title}</p>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-red-500 transition-colors" />
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      </article>
      <TutorialToc toc={doc.toc} course={course} />
    </div>
  );
}
