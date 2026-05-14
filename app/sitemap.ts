import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import {
  destinationsMock,
  experiencesMock,
  ferryRoutesMock,
  guidesMock,
  manualPackages,
  tripjackPackages,
} from "@/lib/mock";
import { fromManual, fromTripJack } from "@/lib/adapters";

/**
 * Sitemap is generated from the same mock data the services read. When the
 * services move to live data, swap the imports below for `await
 * service.list()` calls — `sitemap()` is allowed to be async.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1.0, freq: "daily" },
    { path: "/andaman", priority: 0.95, freq: "weekly" },
    { path: "/packages/domestic", priority: 0.85, freq: "weekly" },
    { path: "/packages/international", priority: 0.85, freq: "weekly" },
    { path: "/honeymoon", priority: 0.85, freq: "weekly" },
    { path: "/luxury", priority: 0.85, freq: "weekly" },
    { path: "/ferry", priority: 0.85, freq: "weekly" },
    { path: "/flights", priority: 0.8, freq: "weekly" },
    { path: "/calculator", priority: 0.7, freq: "weekly" },
    { path: "/experiences", priority: 0.75, freq: "weekly" },
    { path: "/guides", priority: 0.8, freq: "weekly" },
    { path: "/corporate", priority: 0.65, freq: "monthly" },
    { path: "/about", priority: 0.6, freq: "monthly" },
    { path: "/contact", priority: 0.65, freq: "monthly" },
    { path: "/faq", priority: 0.55, freq: "monthly" },
    { path: "/privacy", priority: 0.3, freq: "yearly" },
    { path: "/terms", priority: 0.3, freq: "yearly" },
  ];

  const items: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));

  // Tour packages — both manual and TripJack-sourced, slugs from adapters.
  const tourSlugs = new Set<string>();
  manualPackages.forEach((m) => tourSlugs.add(fromManual(m).slug));
  tripjackPackages.forEach((v) => tourSlugs.add(fromTripJack(v).slug));
  for (const slug of tourSlugs) {
    items.push({
      url: `${SITE.url}/tours/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  for (const d of destinationsMock) {
    if (d.slug === "andaman") continue;
    items.push({
      url: `${SITE.url}/destinations/${d.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  for (const e of experiencesMock) {
    items.push({
      url: `${SITE.url}/experiences/${e.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const g of guidesMock) {
    items.push({
      url: `${SITE.url}/guides/${g.slug}`,
      lastModified: new Date(g.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const r of ferryRoutesMock) {
    items.push({
      url: `${SITE.url}/ferry/${r.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: r.popular ? 0.78 : 0.6,
    });
  }

  return items;
}
