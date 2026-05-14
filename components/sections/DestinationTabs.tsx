"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/Section";
import { DestinationCard } from "@/components/cards/DestinationCard";
import type { Destination } from "@/lib/models";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "All", value: "all" },
  { label: "Andaman", value: "andaman" },
  { label: "India", value: "domestic" },
  { label: "Asia & Pacific", value: "asia-pacific" },
  { label: "Europe", value: "europe" },
  { label: "Indian Ocean", value: "indian-ocean" },
  { label: "Middle East", value: "middle-east" },
] as const;

type TabValue = typeof tabs[number]["value"];

interface DestinationTabsProps {
  destinations: Destination[];
}

export function DestinationTabs({ destinations }: DestinationTabsProps) {
  const [active, setActive] = useState<TabValue>("all");

  const filtered = useMemo(() => {
    if (!destinations || destinations.length === 0) return [];
    if (active === "all") return destinations.slice(0, 8);
    if (active === "andaman") return destinations.filter((d) => d.slug === "andaman");
    if (active === "domestic") return destinations.filter((d) => d.region === "domestic");
    if (active === "europe") return destinations.filter((d) => d.continent === "Europe");
    if (active === "asia-pacific") return destinations.filter((d) => d.region === "international" && d.continent === "Asia");
    if (active === "indian-ocean") return destinations.filter((d) => d.continent === "Indian Ocean");
    if (active === "middle-east") return destinations.filter((d) => d.continent === "Middle East");
    return destinations;
  }, [active, destinations]);

  return (
    <section className="bg-cream py-section">
      <Container>
        <SectionHeader
          eyebrow="Curated Global Destinations"
          title="A globe, edited."
          description="Sixty-five destinations, each one walked by a specialist. Choose a region — we'll show you the journeys we actually recommend."
          viewAllHref="/packages/international"
          viewAllLabel="Browse all destinations"
        />

        <div className="-mx-5 mb-8 overflow-x-auto scroll-rail px-5 sm:mx-0 sm:px-0">
          <div role="tablist" aria-label="Destination region" className="flex gap-2">
            {tabs.map((tab) => {
              const isActive = active === tab.value;
              return (
                <button
                  key={tab.value}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(tab.value)}
                  className={cn(
                    "shrink-0 border-b-2 px-3 py-2 text-[14px] font-medium transition-colors",
                    isActive
                      ? "border-teal text-teal"
                      : "border-transparent text-ink-secondary hover:text-ink",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="-mx-5 flex gap-5 overflow-x-auto scroll-rail px-5 pb-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
            {filtered.slice(0, 8).map((d, i) => (
              <DestinationCard
                key={d.slug}
                destination={d}
                className="w-[240px] shrink-0 sm:w-auto"
                priority={i < 2}
              />
            ))}
          </div>
        ) : (
          <p className="text-ink-muted">No destinations in this region yet — check back soon.</p>
        )}
      </Container>
    </section>
  );
}
