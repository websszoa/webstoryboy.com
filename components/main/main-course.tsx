import Link from "next/link";
import Image from "next/image";
import { courseMenuItems } from "@/lib/tutorial/course";

export default function MainCourse() {
  return (
    <div className="main__course mb-20 pt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {courseMenuItems.map((course, index) => (
          <Link
            key={index}
            href={course.src || "#"}
            className="border rounded-xl p-4 font-anyvid transition-shadow block hover:shadow-md hover:border-red-500 cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-xl font-paperlogy">{course.title}</h2>
              {course.level && (
                <div className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] text-zinc-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  {course.level}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {course.description}
            </p>
            {course.skillCards && course.skillCards.length > 0 && (
              <div className="flex gap-2">
                {course.skillCards.map((skillCard, skillIndex) => (
                  <Image
                    key={skillIndex}
                    src={skillCard.icon.src}
                    width={20}
                    height={20}
                    alt={skillCard.icon.alt}
                  />
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
