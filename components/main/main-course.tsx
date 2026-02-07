import Image from "next/image";
import Link from "next/link";
import { courseMenuItems } from "@/lib/course";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MainCourse() {
  return (
    <div className="main__banner space-y-4 md:space-y-8">
      {courseMenuItems.map((course, index) => (
        <div
          key={index}
          className="border border-dashed border-gray-300 p-4 md:p-6 rounded-2xl hover:shadow-md hover:border-red-500 transition-shadow"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
            <h3 className="text-2xl md:text-3xl font-paperlogy">
              {course.title}
            </h3>
            <Link href={course.src || "#"} className="w-full md:w-auto">
              <Button
                variant="destructive"
                size="sm"
                className="font-nanumNeo shrink-0 bg-red-500 w-full md:w-auto"
              >
                튜토리얼 보기
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <p className="text-muted-foreground text-sm mb-2 leading-relaxed font-anyvid">
            {course.detailDescription}
          </p>
          <Separator className="my-6" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-12">
            <div className="left lg:col-span-3">
              <ul className="grid gap-2 text-sm font-anyvid text-muted-foreground mb-6">
                {course.features?.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-red-500 shrink-0" />
                    <span>
                      <strong className="text-gray-900">{feature.name}</strong>
                      {feature.description}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {course.skillCards?.map((skillCard, index) => (
                  <div
                    key={index}
                    className="border border-black rounded overflow-hidden w-[100px] shrink-0"
                  >
                    <h4 className="font-poppins text-sm bg-yellow-300 p-1 text-center">
                      {skillCard.category}
                    </h4>
                    <div className="flex flex-col items-center justify-center">
                      <Image
                        src={skillCard.icon.src}
                        alt={skillCard.icon.alt}
                        width={skillCard.icon.width}
                        height={skillCard.icon.height}
                        className="py-2"
                      />
                      <span className="text-xs text-muted-foreground border-t w-full text-center py-1">
                        {skillCard.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="right lg:col-span-2">
              <div className="relative w-full h-full min-h-[200px] rounded-2xl overflow-hidden border border-gray-200 group">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  width={1500}
                  height={1000}
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
                {course.site && (
                  <a
                    href={course.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-red-500 group-hover:bg-red-600 px-4 py-2 text-white rounded-t-2xl font-nanumNeo text-sm font-medium flex items-center gap-2 shadow-lg group-hover:shadow-xl backdrop-blur-sm z-10 w-full justify-center transition-all duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    실제 사이트 보기
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
