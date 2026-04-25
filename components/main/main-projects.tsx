import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "마라톤 사이트 만들기",
    description:
      "국내 마라톤·달리기 대회 일정을 한눈에 확인할 수 있는 정보 플랫폼입니다. 대회 검색, 즐겨찾기, 리뷰 기능을 직접 구현하며 배웁니다.",
    level: "준비중",
    // href: "#",
    href: "/tutorial/runzoa/getting-started-with-marathon",
    skills: [
      { src: "/svg/nextjs.svg", alt: "Next.js" },
      { src: "/svg/tailwindcss.svg", alt: "Tailwind CSS" },
      { src: "/svg/supabase.svg", alt: "Supabase" },
      { src: "/svg/vercel.svg", alt: "Vercel" },
      { src: "/svg/shadcn.svg", alt: "shadcn" },
      { src: "/svg/claude.svg", alt: "claude" },
    ],
  },
  {
    title: "준비중입니다",
    description: "새로운 프로젝트를 준비하고 있습니다. 조금만 기다려 주세요.",
    level: "",
    href: "#",
    skills: [],
  },
];

export default function MainProjects() {
  return (
    <div className="main__projects mb-20 pt-20">
      <div className="text-center mb-10">
        <span className="text-sm uppercase tracking-[0.35em] text-red-600 font-poppins dark:text-dark-brand">
          Projects
        </span>
        <h2 className="py-1 md:py-2 text-slate-900 dark:text-white text-2xl md:text-3xl font-anyvid">
          직접 만들며 쌓은 프로젝트
        </h2>
        <p className="text-sm text-muted-foreground font-anyvid">
          학습한 내용을 바탕으로 완성한 실전 프로젝트들을 소개합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map((project, index) => (
          <Link
            key={index}
            href={project.href}
            className="border rounded-xl p-4 font-anyvid transition-shadow block hover:shadow-md hover:border-red-500 cursor-pointer group"
          >
            <div className="flex gap-3 h-full">
              {/* 왼쪽: 번호 (1/10) */}
              <div className="flex flex-col items-center gap-1 shrink-0 w-[10%]">
                <span className="text-xl font-poppins font-bold tracking-widest text-red-500 dark:text-dark-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 w-px bg-border mt-1" />
              </div>

              {/* 오른쪽: 내용 (9/10) */}
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-xl font-paperlogy leading-snug">
                    {project.title}
                  </h3>
                  {project.level && (
                    <div className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] text-zinc-600 shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      {project.level}
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-3 leading-relaxed flex-1">
                  {project.description}
                </p>

                <div className="flex items-center justify-between">
                  {project.skills.length > 0 ? (
                    <div className="flex gap-2">
                      {project.skills.map((skill, skillIndex) => (
                        <Image
                          key={skillIndex}
                          src={skill.src}
                          width={18}
                          height={18}
                          alt={skill.alt}
                        />
                      ))}
                    </div>
                  ) : (
                    <span />
                  )}
                  {project.href !== "#" && (
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
