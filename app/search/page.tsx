import { Suspense } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PackageCard } from "@/components/cards/PackageCard";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { GuideCard } from "@/components/cards/GuideCard";
import { ConciergeCTA } from "@/components/sections/ConciergeCTA";
import { searchService } from "@/lib/services";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Search",
  description: "Search journeys, destinations, and guides at The Vacation Voice.",
  path: "/search",
});

async function SearchResults({ q }: { q: string }) {
  const trimmed = q.trim();
  if (!trimmed) {
    return (
      <p className="text-[15px] text-ink-secondary">
        Type a destination, theme, or country into the search bar above.
      </p>
    );
  }
  const res = await searchService.query(trimmed);
  if (!res.ok) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger-bg/50 p-12 text-center">
        <p className="font-display text-[22px] text-ink">Search is briefly unavailable.</p>
        <p className="mt-2 text-[14px] text-ink-secondary">
          Try again in a moment, or{" "}
          <Link href="/contact" className="text-teal hover:underline">talk to a specialist</Link>.
        </p>
      </div>
    );
  }
  const { packages, destinations, guides, totalCount } = res.data;
  if (totalCount === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-white p-12 text-center">
        <p className="font-display text-[22px] text-ink">No exact matches for "{trimmed}".</p>
        <p className="mt-2 text-[14px] text-ink-secondary">
          Try a broader term, or write to a specialist —{" "}
          <Link href="/contact" className="text-teal hover:underline">we'll build it for you</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-14">
      {packages.length > 0 && (
        <div>
          <SectionHeader eyebrow="Journeys" title={`${packages.length} matching itinerar${packages.length === 1 ? "y" : "ies"}`} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((p) => <PackageCard key={p.slug} data={p} />)}
          </div>
        </div>
      )}
      {destinations.length > 0 && (
        <div>
          <SectionHeader eyebrow="Destinations" title={`${destinations.length} matching destination${destinations.length === 1 ? "" : "s"}`} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((d) => <DestinationCard key={d.slug} destination={d} />)}
          </div>
        </div>
      )}
      {guides.length > 0 && (
        <div>
          <SectionHeader eyebrow="Guides" title={`${guides.length} matching guide${guides.length === 1 ? "" : "s"}`} />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => <GuideCard key={g.slug} guide={g} />)}
          </div>
        </div>
      )}
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  return (
    <>
      <section className="bg-cream pt-10 pb-8">
        <Container>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
          <div className="mt-8 max-w-2xl">
            <p className="text-label uppercase text-teal">Search</p>
            <h1 className="mt-3 font-display text-[clamp(2rem,4vw,2.75rem)] leading-tight tracking-tight text-ink">
              {q ? <>Results for <span className="text-teal">"{q}"</span></> : "Search journeys, destinations & guides"}
            </h1>
          </div>
        </Container>
      </section>

      <Section tone="cream" pad="default">
        <Container>
          <Suspense fallback={<p className="text-ink-muted">Searching…</p>}>
            <SearchResults q={q} />
          </Suspense>
        </Container>
      </Section>

      <ConciergeCTA />
    </>
  );
}
