import { notFound } from "next/navigation";
import { courseIds, type CourseId } from "@/lib/tutorial/config";
import TutorialSidebar from "@/components/tutorial/tutorial-sidebar";

interface TutorialCourseLayoutProps {
  children: React.ReactNode;
  params: Promise<{ course: string }>;
}

export default async function TutorialCourseLayout({
  children,
  params,
}: TutorialCourseLayoutProps) {
  const { course } = await params;
  if (!courseIds.includes(course as CourseId)) notFound();

  return (
    <div className="flex min-h-0 w-full">
      <TutorialSidebar course={course as CourseId} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
