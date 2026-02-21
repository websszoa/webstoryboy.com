interface PageTitleProps {
  subtitle: string;
  title: string;
  description: string;
}

export default function PageTitle({
  subtitle,
  title,
  description,
}: PageTitleProps) {
  return (
    <div className="page__title text-center pb-8 md:pb-10">
      <span className="text-xs font-semibold uppercase tracking-[0.35em] text-red-500/80">
        {subtitle}
      </span>
      <h2 className="font-nanumNeo py-1 md:py-2 text-2xl text-slate-900 md:text-3xl">
        {title}
      </h2>
      <p className="font-anyvid text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
