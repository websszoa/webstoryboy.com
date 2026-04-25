import { notFound } from "next/navigation";
import { courseIds, courseTitles, type CourseId } from "@/lib/tutorial/config";
import TutorialDiscussion from "@/components/tutorial/tutorial-discussion";

interface DiscussionPageProps {
  params: Promise<{ course: string }>;
}

export async function generateMetadata({ params }: DiscussionPageProps) {
  const { course } = await params;
  if (!courseIds.includes(course as CourseId)) return {};
  return {
    title: `토론방 | ${courseTitles[course as CourseId]}`,
  };
}

export default async function DiscussionPage({ params }: DiscussionPageProps) {
  const { course } = await params;
  if (!courseIds.includes(course as CourseId)) notFound();

  return <TutorialDiscussion course={course as CourseId} />;
}
