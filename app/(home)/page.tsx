import MainBanner from "@/components/main/main-banner";
import MainCourse from "@/components/main/main-course";
import MainTitle from "@/components/main/main-title";
import { Divider } from "@/components/ui/divider";

export default async function HomePage() {
  return (
    <>
      <MainTitle />
      <MainBanner />
      <Divider text="courses" className="mb-10 mt-2" />
      <MainCourse />
    </>
  );
}
