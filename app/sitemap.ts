import type { MetadataRoute } from "next";
import { APP_SITE_URL } from "@/lib/constants";
import { courseIds, courseDocList } from "@/lib/tutorial/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: APP_SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${APP_SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${APP_SITE_URL}/notice`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${APP_SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${APP_SITE_URL}/trace`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${APP_SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${APP_SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const tutorialCoursePages: MetadataRoute.Sitemap = courseIds.map((course) => ({
    url: `${APP_SITE_URL}/tutorial/${course}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const tutorialDocPages: MetadataRoute.Sitemap = courseIds.flatMap((course) =>
    courseDocList[course].map((doc) => ({
      url: `${APP_SITE_URL}/tutorial/${course}/${doc.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...tutorialCoursePages, ...tutorialDocPages];
}
