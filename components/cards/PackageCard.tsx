"use client";

/**
 * Unified PackageCard.
 *
 * Consumes the normalised `Package` model — works for BOTH manual and TripJack
 * packages without branching. Visuals are 1:1 with the legacy TourPackageCard
 * (which now thin-forwards to this component).
 *
 * Resilience contract:
 *   • Missing image          → fallback gradient block + label
 *   • Missing rating         → rating pill omitted, not broken
 *   • Missing destinations[] → pills row omitted
 *   • Missing pricing        → "Price on request" rendered instead of zero
 */

import Image from "next/image";
import Link from "next/link";
import { Heart, Plane, Clock } from "lucide-react";
import type { CardBadge, Package } from "@/lib/models";
import { cn, formatINR } from "@/lib/utils";
import { Stars } from "@/components/ui/Stars";

const badgeStyle: Record<CardBadge, string> = {
  "flights-included": "bg-info text-white",
  "flash-sale": "bg-warn text-white",
  "limited-seats": "bg-danger text-white",
  "staff-pick": "bg-gold text-navy",
  exclusive: "bg-navy text-white",
  new: "bg-teal text-white",
  verified: "bg-success text-white",
};

const badgeLabel: Record<CardBadge, string> = {
  "flights-included": "Flights included",
  "flash-sale": "Flash sale",
  "limited-seats": "Limited seats",
  "staff-pick": "Staff picked",
  exclusive: "Exclusive",
  new: "New",
  verified: "Verified",
};

interface PackageCardProps {
  data: Package;
  className?: string;
  priority?: boolean;
  /** Override the link target — useful when surfacing the card in admin/preview contexts. */
  href?: string;
  /** Render a tiny vendor chip in the corner. Off by default — set true on admin/internal surfaces. */
  showVendorChip?: boolean;
}

export function PackageCard({
  data,
  className,
  priority,
  href,
  showVendorChip = false,
}: PackageCardProps) {
  const detailHref = href ?? `/tours/${data.slug}`;
  const isExclusive = data.badges?.includes("exclusive");
  const hasFlights = data.badges?.includes("flights-included");
  const primaryBadge = data.badges?.find((b) => b !== "flights-included");
  const saved =
    data.pricing.originalPerAdult && data.pricing.perAdult
      ? data.pricing.originalPerAdult - data.pricing.perAdult
      : 0;

  return (
    <article
      data-vendor={data.vendor.source}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg bg-white transition-all duration-base",
        "shadow-card hover:-translate-y-1 hover:shadow-hover",
        isExclusive ? "border border-gold/60" : "border border-line",
        className,
      )}
    >
      <Link href={detailHref} className="relative block aspect-[16/10] overflow-hidden bg-surface">
        {data.hero.image ? (
          <Image
            src={data.hero.image}
            alt={data.hero.alt ?? data.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
            priority={priority}
            className="object-cover transition-transform duration-[600ms] ease-premium group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy/10 to-teal/10">
            <span className="font-display text-sm text-ink-muted">{data.destination}</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {hasFlights && (
            <span className={cn("inline-flex items-center gap-1 rounded-sm px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em]", badgeStyle["flights-included"])}>
              <Plane className="h-3 w-3" aria-hidden /> {badgeLabel["flights-included"]}
            </span>
          )}
          {primaryBadge && (
            <span className={cn("inline-flex items-center rounded-sm px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em]", badgeStyle[primaryBadge])}>
              {badgeLabel[primaryBadge]}
            </span>
          )}
        </div>

        {showVendorChip && (
          <span className="absolute right-12 top-3 inline-flex items-center rounded-sm bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-white">
            {data.vendor.source === "tripjack" ? "TripJack" : "TVV"}
          </span>
        )}

        {typeof data.rating === "number" && (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-pill bg-navy/65 px-2.5 py-1 text-white backdrop-blur-sm">
            <Stars value={data.rating} count={data.ratingCount} invert size="sm" />
          </div>
        )}

        <button
          type="button"
          aria-label="Save to wishlist"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-ink-secondary shadow-card backdrop-blur-sm transition-colors hover:text-danger"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-1.5 text-caption text-ink-muted">
          <Clock className="h-3 w-3" aria-hidden />
          <span>{data.durationDays} days &amp; {data.durationNights} nights</span>
        </div>

        <Link href={detailHref} className="block">
          <h3 className="clamp-2 font-display text-[18px] leading-[1.25] tracking-tight text-ink transition-colors hover:text-teal">
            {data.title}
          </h3>
          {data.subtitle && (
            <p className="mt-1 line-clamp-1 text-[12px] text-ink-muted">{data.subtitle}</p>
          )}
        </Link>

        {data.destinations && data.destinations.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.destinations.slice(0, 3).map((d) => (
              <span
                key={`${d.days}-${d.city}`}
                className="inline-flex items-center rounded-sm border border-line bg-surface px-2 py-0.5 text-[10px] font-medium text-ink-secondary"
              >
                {d.days}D {d.city}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            {data.pricing.originalPerAdult && (
              <p className="font-mono text-[12px] text-danger line-through">
                {formatINR(data.pricing.originalPerAdult)}
              </p>
            )}
            {data.pricing.perAdult > 0 ? (
              <p className="font-mono text-[20px] font-bold leading-none text-teal">
                {formatINR(data.pricing.perAdult)}
                <span className="ml-1 text-[11px] font-normal text-ink-muted">/Adult</span>
              </p>
            ) : (
              <p className="font-display text-[15px] font-medium text-teal">Price on request</p>
            )}
            {saved > 0 && (
              <p className="mt-1 text-[11px] text-success">save {formatINR(saved)}</p>
            )}
          </div>
        </div>

        <Link
          href={detailHref}
          className="mt-1 inline-flex h-10 w-full items-center justify-center rounded-md bg-teal px-4 text-[14px] font-medium text-white transition-colors duration-fast hover:bg-teal-hover"
        >
          Enquire
        </Link>
      </div>
    </article>
  );
}
