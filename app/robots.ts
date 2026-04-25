import type { MetadataRoute } from "next";
import { APP_SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/profile/",
          "/login",
          "/sign-up",
          "/sign-up-success",
          "/forgot-password",
          "/update-password",
          "/callback-email",
          "/callback-sns",
        ],
      },
    ],
    sitemap: `${APP_SITE_URL}/sitemap.xml`,
  };
}
