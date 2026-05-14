"use client";

import { useMemo, useState } from "react";
import { PackageCard } from "@/components/cards/PackageCard";
import { FilterChips } from "@/components/ui/FilterChips";
import { cn } from "@/lib/utils";
import type { Package } from "@/lib/models";

interface PackageListingProps {
  packages: Package[];
  themes?: { label: string; value: string }[];
  emptyTitle?: string;
  emptyHint?: string;
}

const defaultThemes = [
  { label: "All", value: "all" },
  { label: "Honeymoon", value: "honeymoon" },
  { label: "Luxury", value: "luxury" },
  { label: "Family", value: "family" },
  { label: "Adventure", value: "adventure" },
  { label: "Culture", value: "culture" },
  { label: "Wellness", value: "wellness" },
];

const sortOptions = [
  { label: "Most relevant", value: "relevant" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
  { label: "Top rated", value: "rating" },
  { label: "Shortest duration", value: "duration-asc" },
];

export function PackageListing({
  packages,
  themes = defaultThemes,
  emptyTitle = "No matches — yet.",
  emptyHint = "Try removing a filter, or write to a specialist — we'll build one for you.",
}: PackageListingProps) {
  const [theme, setTheme] = useState("all");
  const [sort, setSort] = useState("relevant");

  const filtered = useMemo(() => {
    if (!packages) return [];
    const base = theme === "all" ? packages : packages.filter((p) => p.themes?.includes(theme));
    const copy = [...base];
    switch (sort) {
      case "price-asc": copy.sort((a, b) => a.pricing.perAdult - b.pricing.perAdult); break;
      case "price-desc": copy.sort((a, b) => b.pricing.perAdult - a.pricing.perAdult); break;
      case "rating": copy.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      case "duration-asc": copy.sort((a, b) => a.durationDays - b.durationDays); break;
    }
    return copy;
  }, [packages, theme, sort]);

  return (
    <>
      <div className="sticky top-16 z-20 -mx-5 mb-10 border-y border-line bg-cream/95 px-5 py-3 backdrop-blur-md sm:mx-0 sm:px-0">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="min-w-0 flex-1">
            <FilterChips options={themes} defaultValue="all" onChange={setTheme} ariaLabel="Filter by theme" />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="shrink-0 text-[12px] text-ink-secondary">Sort by</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={cn(
                "h-9 rounded-md border border-line bg-white px-3 text-[13px] text-ink",
                "focus:border-teal focus:outline-none",
              )}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pb-5">
        <p className="text-[13px] text-ink-secondary">
          Showing <span className="font-semibold text-ink">{filtered.length}</span> curated journeys
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line bg-white p-12 text-center">
          <p className="font-display text-[20px] text-ink">{emptyTitle}</p>
          <p className="mt-2 text-[13px] text-ink-secondary">{emptyHint}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PackageCard key={p.slug} data={p} />
          ))}
        </div>
      )}
    </>
  );
}
