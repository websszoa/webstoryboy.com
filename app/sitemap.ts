import type { MetadataRoute } from "next";
import { APP_SITE_URL } from "@/lib/constants";

const SITEMAP_ROUTES = [
  "",
  "/intro",
  "/notice",
  "/contact",
  "/terms",
  "/privacy",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return SITEMAP_ROUTES.map((path) => ({
    url: `${APP_SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
