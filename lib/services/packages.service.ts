/**
 * Packages service — unified domain over manual + TripJack sources.
 *
 * Consumers (pages, sections) call this and receive `Package`. They never
 * see the raw manual or vendor shapes. The service handles:
 *
 *   • merging manual + vendor lists
 *   • running adapters at the boundary
 *   • mock vs live switching
 *   • deterministic ordering for SEO-stable rendering
 */

import { apiClient, apiConfig, endpoints, ok, fail, type ServiceResult } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import type { Package, Region } from "@/lib/models";
import { manualPackages, tripjackPackages } from "@/lib/mock";
import { fromManualList, fromTripJackList } from "@/lib/adapters";

export interface PackageQuery {
  region?: Region;
  destination?: string;
  theme?: string;
  source?: "manual" | "tripjack";
  limit?: number;
  /** Sort key; default = manual-first then by rating desc. */
  sort?: "relevant" | "price-asc" | "price-desc" | "rating" | "duration-asc";
}

function allUnified(): Package[] {
  return [...fromManualList(manualPackages), ...fromTripJackList(tripjackPackages)];
}

function applyQuery(list: Package[], q: PackageQuery): Package[] {
  let out = list;
  if (q.source) out = out.filter((p) => p.vendor.source === q.source);
  if (q.region) out = out.filter((p) => p.region === q.region);
  if (q.destination) {
    const needle = q.destination.toLowerCase();
    out = out.filter((p) => p.destination.toLowerCase().includes(needle));
  }
  if (q.theme && q.theme !== "all") {
    out = out.filter((p) => (p.themes ?? []).includes(q.theme!.toLowerCase()));
  }
  const sorted = [...out];
  switch (q.sort) {
    case "price-asc": sorted.sort((a, b) => a.pricing.perAdult - b.pricing.perAdult); break;
    case "price-desc": sorted.sort((a, b) => b.pricing.perAdult - a.pricing.perAdult); break;
    case "rating": sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
    case "duration-asc": sorted.sort((a, b) => a.durationDays - b.durationDays); break;
    default:
      // Manual-first, then by rating
      sorted.sort((a, b) => {
        if (a.vendor.source !== b.vendor.source) return a.vendor.source === "manual" ? -1 : 1;
        return (b.rating ?? 0) - (a.rating ?? 0);
      });
  }
  return q.limit ? sorted.slice(0, q.limit) : sorted;
}

export const packagesService = {
  /** Full list (filtered/sorted/limited). */
  async list(q: PackageQuery = {}): Promise<ServiceResult<Package[]>> {
    if (apiConfig.useMock) return ok(applyQuery(allUnified(), q), "mock");
    try {
      const data = await apiClient.get<Package[]>(endpoints.packages.list);
      return ok(applyQuery(data ?? [], q), "live");
    } catch (err) {
      return fail<Package[]>(ApiError.fromUnknown(err), "live");
    }
  },

  /** Single package by frontend slug — searches both sources. */
  async getBySlug(slug: string): Promise<ServiceResult<Package | null>> {
    if (apiConfig.useMock) {
      const found = allUnified().find((p) => p.slug === slug) ?? null;
      return ok(found, "mock");
    }
    try {
      const data = await apiClient.get<Package | null>(endpoints.packages.detail(slug), { treat404AsNull: true });
      return ok(data, "live");
    } catch (err) {
      return fail<Package | null>(ApiError.fromUnknown(err), "live");
    }
  },

  /** Related packages — same region or shared themes, excluding self. */
  async getRelated(slug: string, limit = 6): Promise<ServiceResult<Package[]>> {
    const all = allUnified();
    const me = all.find((p) => p.slug === slug);
    if (!me) return ok([], "mock");
    const related = all.filter((p) =>
      p.slug !== me.slug && (
        p.region === me.region || (me.themes ?? []).some((t) => p.themes?.includes(t))
      ),
    );
    return ok(related.slice(0, limit), apiConfig.useMock ? "mock" : "live");
  },

  /** Convenience: by region (kept for SEO-friendly silo pages). */
  byRegion(region: Region, limit?: number) {
    return this.list({ region, limit });
  },

  /** Convenience: by theme (honeymoon, luxury, etc.). */
  byTheme(theme: string, limit?: number) {
    return this.list({ theme, limit });
  },

  /** Convenience: featured shelf — manual-priority, top-rated. */
  featured(limit = 8) {
    return this.list({ sort: "relevant", limit });
  },
};

export type PackagesService = typeof packagesService;
