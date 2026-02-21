import Link from "next/link";
import { footerColumnMenus } from "@/lib/menu";

export default function FooterMenu() {
  return (
    <div className="hidden md:grid font-anyvid grid-cols-3 gap-4 mt-1 md:mt-12">
      {footerColumnMenus.map((column) => (
        <div key={column.title}>
          <h4 className="text-gray-800 dark:text-gray-200 mb-3 text-sm font-bold">
            {column.title}
          </h4>
          <ul className="text-muted-foreground text-sm space-y-1">
            {column.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-brand transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
