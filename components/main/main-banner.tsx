import Image from "next/image";
import Link from "next/link";

const THUMBNAIL_ITEMS = [
  {
    src: "/thumbnail/eventzoa.jpg",
    alt: "Eventzoa",
    label: "Eventzoa",
    href: "https://www.eventzoa.com/",
  },
  {
    src: "/thumbnail/kcalzoa.jpg",
    alt: "Kcalzoa",
    label: "Kcalzoa",
    href: "https://www.kcalzoa.com/",
  },
  {
    src: "/thumbnail/runzoa.jpg",
    alt: "Runzoa",
    label: "Runzoa",
    href: "https://www.runzoa.com/",
  },
] as const;

export default function MainBanner() {
  return (
    <section className="py-10 md:py-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {THUMBNAIL_ITEMS.map((item) => (
          <Link
            key={item.alt}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all"
          >
            <div className="aspect-4/3 w-full overflow-hidden">
              <Image
                src={item.src}
                alt={item.alt}
                width={600}
                height={450}
                loading="eager"
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-4 py-3">
              <span className="font-nanumNeo text-sm font-medium text-white drop-shadow-sm">
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
