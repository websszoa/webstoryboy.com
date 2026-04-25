import { redirect, notFound } from "next/navigation";
import { courseDocList, courseIds, type CourseId } from "@/lib/tutorial/config";

interface TutorialCoursePageProps {
  params: Promise<{ course: string }>;
}

export default async function TutorialCoursePage({
  params,
}: TutorialCoursePageProps) {
  const { course } = await params;
  if (!courseIds.includes(course as CourseId)) notFound();

  const docs = courseDocList[course as CourseId];
  const firstSlug = docs?.[0]?.slug;
  if (firstSlug) redirect(`/tutorial/${course}/${firstSlug}`);
  redirect(`/tutorial`);
}
