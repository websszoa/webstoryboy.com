import type { MetadataRoute } from "next";
import { APP_SITE_URL } from "@/lib/constants";

const SITEMAP_ROUTES = [
  { path: "", changeFrequency: "daily" as const, priority: 1 },
  { path: "/notice", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/terms", changeFrequency: "yearly" as const, priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.5 },
  { path: "/profile", changeFrequency: "weekly" as const, priority: 0.6 },
  { path: "/favorites", changeFrequency: "weekly" as const, priority: 0.6 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return SITEMAP_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${APP_SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
