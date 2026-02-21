import type { MetadataRoute } from "next";
import { APP_SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/*"],
    },
    sitemap: `${APP_SITE_URL}/sitemap.xml`,
    host: APP_SITE_URL,
  };
}
