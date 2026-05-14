/**
 * @deprecated — Import from `@/lib/services` instead.
 *
 * This file is a synchronous, mock-backed compatibility shim retained while
 * the codebase migrates onto the service layer. The exports below resolve
 * eagerly against `lib/mock/*` data (post-adapter) and re-attach legacy
 * `priceCurrent` / `image` fields so existing component imports continue to
 * compile and render until they're migrated.
 *
 *   Old:  import { tourPackages, getTourBySlug } from "@/lib/data";
 *   New:  import { packagesService } from "@/lib/services";
 *         const { data } = await packagesService.list();
 */

import type { Package, TourPackage } from "@/lib/types";
import { fromManualList, fromTripJackList } from "./adapters";
import {
  andamanSpotlightMock,
  destinationsMock,
  experiencesMock,
  faqsMock,
  guidesMock,
  manualPackages,
  reelsMock,
  reviewsMock,
  tripjackPackages,
  trustStatsMock,
} from "./mock";

/* ============================================================
   Unified packages, with legacy flat fields re-attached.
   ============================================================ */

function withLegacy(pkg: Package): TourPackage {
  return {
    ...pkg,
    priceCurrent: pkg.pricing.perAdult,
    priceOriginal: pkg.pricing.originalPerAdult,
    image: pkg.hero.image,
    gallery: pkg.hero.gallery?.map((m) => m.url),
  };
}

const unified: TourPackage[] = [
  ...fromManualList(manualPackages),
  ...fromTripJackList(tripjackPackages),
].map(withLegacy);

export const tourPackages: TourPackage[] = unified;

export const destinations = destinationsMock;
export const experiences = experiencesMock;
export const guides = guidesMock;
export const reels = reelsMock;
export const andamanSpotlight = andamanSpotlightMock;
export const reviews = reviewsMock;
export const trustStats = trustStatsMock;
export const faqs = faqsMock;

/* ============================================================
   Legacy selectors — kept for backward compatibility only.
   New code should call services directly.
   ============================================================ */

export const getTourBySlug = (slug: string) => unified.find((t) => t.slug === slug);
export const getDestinationBySlug = (slug: string) => {
  const lower = slug.toLowerCase();
  return destinationsMock.find(
    (d) => d.slug === lower || d.aliases?.includes(lower),
  );
};
export const getGuideBySlug = (slug: string) => guidesMock.find((g) => g.slug === slug);

export const getToursByRegion = (region: TourPackage["region"]) =>
  unified.filter((t) => t.region === region);

export const getToursByTheme = (theme: string) =>
  unified.filter((t) => t.themes?.includes(theme.toLowerCase()));
