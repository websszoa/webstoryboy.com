import { cn } from "@/lib/utils";
import FooterCopyright from "./footer-copyright";
import FooterInfo from "./footer-info";

const footerVariants = {
  main: "max-w-7xl",
  tutorial: "max-w-[1400px]",
  auth: "max-w-[460px]",
} as const;

interface FooterProps {
  variant?: keyof typeof footerVariants;
}

export default function Footer({ variant = "main" }: FooterProps) {
  return (
    <footer
      className={cn(
        "mx-auto px-4 py-4 pb-20 pt-0",
        footerVariants[variant],
      )}
    >
      <FooterInfo />
      <FooterCopyright />
    </footer>
  );
}
