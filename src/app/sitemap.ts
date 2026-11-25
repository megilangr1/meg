import type { MetadataRoute } from "next";

import prisma from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

// sitemap butuh DB; saat build DB tidak ada, jadi render on-demand (bukan prerender).
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await prisma.project.findMany({
    where: { publishedAt: { not: null } },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
    select: { slug: true, updatedAt: true },
  });

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/work`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...projects.map((project) => ({
      url: `${siteConfig.url}/work/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
