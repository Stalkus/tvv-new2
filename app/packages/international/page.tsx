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
  title: "International Tour Packages — Curated Global Journeys",
  description:
    "Curated international holiday packages — Japan, Bali, Maldives, Europe, Switzerland, Dubai, Vietnam. Specialist-planned editorial itineraries with vetted stays and 24/7 concierge.",
  path: "/packages/international",
  keywords: [
    "international tour packages",
    "luxury international holiday",
    "Maldives honeymoon package",
    "Japan tour package",
    "Europe tour package",
    "Bali holiday package",
    "Switzerland tour package",
  ],
});

export const revalidate = 300;

export default async function InternationalListingPage() {
  const [toursRes, trustRes] = await Promise.all([
    packagesService.byRegion("international"),
    reviewsService.trustStats(),
  ]);
  const tours = toursRes.ok ? toursRes.data : [];

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Packages", href: "/packages/international" },
    { label: "International tour packages" },
  ];

  return (
    <>
      <section className="bg-cream pt-8 pb-12">
        <Container>
          <Breadcrumb items={breadcrumbs} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr,1fr] lg:items-end">
            <div>
              <p className="text-label uppercase text-teal">International</p>
              <h1 className="mt-3 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-tight text-balance text-ink">
                A globe, edited — to the few routes worth the flight.
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-secondary">
                {tours.length} curated international itineraries across {Array.from(new Set(tours.map(t => t.destination))).length} destinations. From a quiet
                Kyoto-Hakone route to a private overwater sanctuary in Baa Atoll — every journey is designed by
                a destination specialist who has walked it themselves.
              </p>
            </div>
            <div className="relative aspect-[5/3] overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85"
                alt="A Kyoto evening — one of our specialists' favourite routes"
                fill
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
          <PackageListing
            packages={tours}
            themes={[
              { label: "All", value: "all" },
              { label: "Honeymoon", value: "honeymoon" },
              { label: "Luxury", value: "luxury" },
              { label: "Mountain", value: "mountain" },
              { label: "Coastal", value: "coastal" },
              { label: "Culture", value: "culture" },
              { label: "Food", value: "food" },
              { label: "City", value: "city" },
            ]}
          />
        </Container>
      </section>

      <section className="bg-white py-section">
        <Container size="default">
          <h2 className="font-display text-[26px] text-ink">About our international tour packages</h2>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-secondary">
            <p>
              Each international package is built by a destination specialist with ground experience — and
              honoured by partner hotels we've worked with for years. We don't resell off-the-shelf inventory.
              Every property, transfer, and guide on a TVV itinerary is one we'd send our own family to.
            </p>
            <p>
              Flights, visas, and travel insurance are quoted alongside every proposal. Premium-cabin and
              private-aviation upgrades are available on most routes — ask your specialist.
            </p>
          </div>
        </Container>
      </section>

      <ConciergeCTA
        title="Have a destination in mind we haven't listed?"
        description="We've sent travellers everywhere from Bhutan to the Galápagos. If it's worth the flight, we can plan it."
      />

      <JsonLd
        data={breadcrumbJsonLd(
          breadcrumbs.map((b) => ({ name: b.label, url: b.href ?? "/packages/international" })),
        )}
      />
    </>
  );
}
