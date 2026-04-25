import MainCourse from "@/components/main/main-course";
import MainProjects from "@/components/main/main-projects";
import MainSteps from "@/components/main/main-steps";
import MainTitle from "@/components/main/main-title";

import { Divider } from "@/components/ui/divider";

export default async function HomePage() {
  return (
    <>
      <MainTitle />
      <MainSteps />
      <Divider className="my-20" />
      <MainCourse />
      <Divider className="my-20" />
      <MainProjects />
    </>
  );
}
