/**
 * TripJack vendor package → unified Package.
 *
 * The shape mismatch this adapter resolves:
 *   priceInfo.sellingPricePerAdult       →  pricing.perAdult
 *   priceInfo.publishedPricePerAdult     →  pricing.originalPerAdult
 *   thumbnailUrl + images                →  hero.image + hero.gallery
 *   itinerary[].dayNo / .cityName        →  itinerary[].day / .city
 *   cities[].cityName + cities[].nights  →  destinations[]
 *
 * If TripJack changes a field name, only this adapter needs to change.
 */

import type {
  CardBadge,
  ItineraryDay,
  Package,
  VendorPackage,
} from "@/lib/models";
import { regionFor, unifyThemes, vendorSlug } from "./utils";

function deriveBadges(input: VendorPackage): CardBadge[] {
  const badges = new Set<CardBadge>();
  const tagsLower = (input.tags ?? []).map((t) => t.toLowerCase());
  if (tagsLower.includes("flights-included")) badges.add("flights-included");
  if (tagsLower.includes("flash-sale")) badges.add("flash-sale");
  if (tagsLower.includes("limited-seats")) badges.add("limited-seats");
  if (tagsLower.includes("staff-pick")) badges.add("staff-pick");
  if (tagsLower.includes("exclusive")) badges.add("exclusive");
  if (tagsLower.includes("premium") && !badges.has("staff-pick")) badges.add("exclusive");
  // Always flag vendor-sourced items as verified at boundary
  return [...badges];
}

export function fromTripJack(input: VendorPackage): Package {
  const itinerary: ItineraryDay[] | undefined = input.itinerary?.map((d) => ({
    day: d.dayNo,
    title: d.title,
    city: d.cityName,
    description: d.description,
    stay: d.hotelName,
    meals: d.mealsIncluded,
  }));

  const slug = vendorSlug(input.vendorPackageCode || input.packageId, input.packageName);

  return {
    slug,
    vendor: {
      source: "tripjack",
      externalId: input.packageId,
      vendorName: input.vendorName,
      vendorUrl: input.vendorDetailUrl,
    },
    title: input.packageName,
    subtitle: input.shortDescription,
    description: input.longDescription,
    destination: input.destinationName,
    region: regionFor(input.countryCode),
    countryCode: input.countryCode,
    durationDays: input.totalDays,
    durationNights: input.totalNights,
    rating: input.rating,
    ratingCount: input.reviewCount,
    pricing: {
      currency: (input.priceInfo.currency as Package["pricing"]["currency"]) ?? "INR",
      perAdult: input.priceInfo.sellingPricePerAdult,
      originalPerAdult: input.priceInfo.publishedPricePerAdult,
      pricingModel: "per-adult",
      dynamic: true, // vendor-sourced prices are dynamic by nature
      breakdown: {
        basePerAdult: input.priceInfo.sellingPricePerAdult,
        feesIncluded: input.priceInfo.taxesIncluded,
      },
    },
    hero: {
      image: input.thumbnailUrl,
      gallery: input.images?.map((url) => ({ url })),
    },
    destinations: (input.cities ?? []).map((c) => ({ days: c.nights, city: c.cityName })),
    badges: deriveBadges(input),
    themes: unifyThemes(input.themes, input.tags),
    highlights: input.highlights,
    inclusions: input.inclusions,
    exclusions: input.exclusions,
    itinerary,
    policy: {
      cancellation: input.cancellationPolicy,
      payment: input.paymentPolicy,
    },
    audit: { vendorSyncedAt: input.lastSyncedAt },
    flags: {
      dynamicPricing: true,
      instantConfirm: true,
    },
  };
}

export function fromTripJackList(inputs: VendorPackage[]): Package[] {
  return inputs.map(fromTripJack);
}
