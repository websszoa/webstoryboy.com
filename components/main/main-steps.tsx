import Link from "next/link";
import {
  Target,
  Palette,
  Code2,
  Rocket,
  ShieldCheck,
  BarChart3,
  Megaphone,
  Expand,
} from "lucide-react";
import { steps } from "@/lib/steps";

const iconMap = {
  Target,
  Palette,
  Code2,
  Rocket,
  ShieldCheck,
  BarChart3,
  Megaphone,
  Expand,
} as const;

export default function MainSteps() {
  return (
    <section className="pt-6 pb-6" aria-label="1인 개발자 8단계 프레임워크">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full">
        {steps.map((step) => {
          const Icon = iconMap[step.icon as keyof typeof iconMap] ?? Target;
          return (
            <Link
              key={step.number}
              href={`/about?tab=${step.number}#about-steps`}
              className="block focus-visible:outline-none "
            >
              <article className="flex min-h-[180px] flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:shadow-md hover:border-red-500 focus-visible:ring-2 focus-visible:ring-ring md:min-h-[200px] md:p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-poppins font-medium tracking-widest text-destructive">
                    {step.number}
                  </span>
                  <span className="text-xs font-poppins uppercase tracking-wider text-muted-foreground shrink-0">
                    {step.subtitle}
                  </span>
                </div>
                <h4 className="mt-2.5 text-lg md:text-xl font-anyvid text-foreground">
                  {step.title}
                </h4>
                <p className="mt-2 flex-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground font-nanumNeo">
                  {step.description}
                </p>
                <p className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-sm text-muted-foreground font-anyvid">
                  <Icon
                    className="size-3.5 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <span>{step.question}</span>
                </p>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
