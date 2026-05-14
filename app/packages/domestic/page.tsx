import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PackageListing } from "@/components/sections/PackageListing";
import { ConciergeCTA } from "@/components/sections/ConciergeCTA";
import { TrustBar } from "@/components/sections/TrustBar";
import { JsonLd } from "@/components/ui/JsonLd";
import { packagesService, reviewsService } from "@/lib/services";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "India Tour Packages — Curated Domestic Journeys",
  description:
    "Curated India tour packages — Kerala, Rajasthan, Ladakh, Himachal, Kashmir, Andaman, Sikkim. Specialist-planned, fully customisable, with 24/7 concierge.",
  path: "/packages/domestic",
  keywords: [
    "India tour packages",
    "domestic holiday packages",
    "Kerala tour package",
    "Rajasthan tour package",
    "Ladakh tour package",
    "Andaman package India",
    "luxury India tour",
  ],
});

export const revalidate = 300;

export default async function DomesticListingPage() {
  const [domesticRes, andamanRes, trustRes] = await Promise.all([
    packagesService.byRegion("domestic"),
    packagesService.byRegion("andaman"),
    reviewsService.trustStats(),
  ]);
  const tours = [
    ...(domesticRes.ok ? domesticRes.data : []),
    ...(andamanRes.ok ? andamanRes.data : []),
  ];

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Packages", href: "/packages/domestic" },
    { label: "India tour packages" },
  ];

  return (
    <>
      <section className="bg-cream pt-8 pb-12 lg:pt-16 lg:pb-20">
        <Container>
          <Breadcrumb items={breadcrumbs} />
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr,1fr] lg:items-center">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-teal">Domestic</p>
              <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-tight text-balance text-ink">
                India, the way our specialists travel it.
              </h1>
              <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-secondary text-pretty">
                A working shelf of {tours.length} domestic journeys — from a 5-night Andaman classic to a 9-day Ladakh
                circuit. Every itinerary is a starting point. Your route, dates, and pace are entirely yours.
              </p>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
              <Image
                src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85"
                alt="Old-world Rajasthan palaces, the kind we route around"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <TrustBar stats={trustRes.ok ? trustRes.data : []} />

      <section className="bg-cream pb-section pt-12">
        <Container>
          <PackageListing packages={tours} />
        </Container>
      </section>

      <section className="bg-white py-section">
        <Container size="default">
          <h2 className="font-display text-[26px] text-ink">About our India tour packages</h2>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-secondary">
            <p>
              The Vacation Voice has been designing India journeys for over fifteen years. We work across
              eight states with vetted ground partners and our own teams in the Andamans, Kerala, and Rajasthan.
              Every package on this page is a real, working itinerary — sequenced for travel pace, not for sales.
            </p>
            <p>
              Most travellers use these itineraries as a starting point. A specialist will adjust the route to
              your dates, add or remove cities, and recommend properties that match how you actually want to
              travel: a converted heritage haveli in Jodhpur, a houseboat in Alleppey, or a beachfront villa in
              Havelock. Domestic flights, transfers, and experiences are built into each proposal.
            </p>
            <p>
              Our concierge is reachable through your trip — every TVV traveller has a specialist on WhatsApp,
              twenty-four hours, seven days, in case the smallest thing needs solving.
            </p>
          </div>
        </Container>
      </section>

      <ConciergeCTA
        title="Looking for something more specific?"
        description="Tell a specialist what you have in mind — heritage, slow travel, family, mountains. We'll send a written proposal within four hours."
      />

      <JsonLd
        data={breadcrumbJsonLd(
          breadcrumbs.map((b) => ({ name: b.label, url: b.href ?? "/packages/domestic" })),
        )}
      />
    </>
  );
}
