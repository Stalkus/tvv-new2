import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Section } from "@/components/ui/Section";
import { PackageListing } from "@/components/sections/PackageListing";
import { ConciergeCTA } from "@/components/sections/ConciergeCTA";
import { TrustBar } from "@/components/sections/TrustBar";
import { packagesService, reviewsService } from "@/lib/services";
import { buildMetadata } from "@/lib/seo";

const regions: Record<string, {
  label: string;
  description: string;
  destinations: string[];
  image: string;
}> = {
  andaman: {
    label: "Andaman Islands",
    description: "Twelve curated Andaman itineraries — from a 5-night classic to a 10-night honeymoon route.",
    destinations: ["Andaman Islands"],
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=1800&q=85",
  },
  "north-india": {
    label: "North India",
    description: "Rajasthan, Kashmir, Himachal, Ladakh — heritage palaces, mountain passes and Himalayan quiet.",
    destinations: ["Rajasthan", "Ladakh", "Kashmir", "Himachal"],
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1800&q=85",
  },
  "south-india": {
    label: "South India",
    description: "Kerala backwaters, Coorg coffee country, Tamil temples — a slower, greener India.",
    destinations: ["Kerala"],
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1800&q=85",
  },
  "east-india": {
    label: "East India",
    description: "Sikkim, Darjeeling, Bhutan-edge journeys — high tea, quiet monasteries, eastern Himalaya.",
    destinations: ["Sikkim"],
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1800&q=85",
  },
  "west-india": {
    label: "West India",
    description: "Goa, the Konkan coast, Gujarat heritage — Portuguese cafés and slow afternoons.",
    destinations: ["Goa"],
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1800&q=85",
  },
};

export function generateStaticParams() {
  return Object.keys(regions).map((region) => ({ region }));
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  const r = regions[region];
  if (!r) return buildMetadata({ title: "Region not found", description: "", path: `/packages/domestic/${region}` });
  return buildMetadata({
    title: `${r.label} Tour Packages — Curated by TVV`,
    description: r.description,
    path: `/packages/domestic/${region}`,
    image: r.image,
    keywords: [`${r.label} tour package`, `${r.label} holiday`, "luxury India"],
  });
}

export const revalidate = 300;

export default async function RegionListingPage({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  const r = regions[region];
  if (!r) notFound();

  const [allDomestic, allAndaman, trustRes] = await Promise.all([
    packagesService.byRegion("domestic"),
    packagesService.byRegion("andaman"),
    reviewsService.trustStats(),
  ]);
  const pool = [
    ...(allDomestic.ok ? allDomestic.data : []),
    ...(allAndaman.ok ? allAndaman.data : []),
  ];
  const tours = pool.filter((t) =>
    r.destinations.some((d) => t.destination.toLowerCase().includes(d.toLowerCase())),
  );

  return (
    <>
      <section className="bg-cream pt-8 pb-12">
        <Container>
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Packages", href: "/packages/domestic" },
              { label: r.label },
            ]}
          />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr,1fr] lg:items-end">
            <div>
              <p className="text-label uppercase text-teal">Domestic · {r.label}</p>
              <h1 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-tight text-balance text-ink">
                {r.label}, the way our specialists travel it.
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-secondary">{r.description}</p>
            </div>
            <div className="relative aspect-[5/3] overflow-hidden rounded-xl">
              <Image src={r.image} alt={r.label} fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
            </div>
          </div>
        </Container>
      </section>

      <TrustBar stats={trustRes.ok ? trustRes.data : []} />

      <Section tone="cream" pad="default">
        <Container>
          {tours.length > 0 ? (
            <PackageListing packages={tours} />
          ) : (
            <div className="rounded-xl border border-dashed border-line bg-white p-12 text-center">
              <p className="font-display text-[22px] text-ink">No published itineraries here — yet.</p>
              <p className="mt-2 text-[14px] text-ink-secondary">
                Tell us what you have in mind. Our specialists build {r.label} routes on request.
              </p>
            </div>
          )}
        </Container>
      </Section>

      <ConciergeCTA title={`Looking for a tailored ${r.label} trip?`} />
    </>
  );
}
