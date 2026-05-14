import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PackageCard } from "@/components/cards/PackageCard";
import { ButtonLink } from "@/components/ui/Button";
import { ConciergeCTA } from "@/components/sections/ConciergeCTA";
import { JsonLd } from "@/components/ui/JsonLd";
import { CardRail, CardRailItem } from "@/components/sections/CardRail";
import { destinationsService, packagesService } from "@/lib/services";
import { destinationsMock } from "@/lib/mock";
import { buildMetadata, breadcrumbJsonLd, SITE } from "@/lib/seo";
import { formatPriceShort } from "@/lib/utils";

export function generateStaticParams() {
  return destinationsMock.filter((d) => d.slug !== "andaman").map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await destinationsService.getBySlug(slug);
  if (!res.ok || !res.data) {
    return buildMetadata({ title: "Destination not found", description: "", path: `/destinations/${slug}` });
  }
  const d = res.data;
  return buildMetadata({
    title: `${d.name} Tour Packages — Curated by TVV`,
    description: `Specialist-planned ${d.name} tour packages from ${formatPriceShort(d.startsFrom)}. ${d.tagline}. Editorial itineraries, vetted stays, 24/7 concierge.`,
    path: `/destinations/${d.slug}`,
    image: d.image,
    keywords: [`${d.name} tour package`, `${d.name} holiday`, `luxury ${d.name}`, `${d.name} honeymoon`],
  });
}

export const revalidate = 600;

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "andaman") redirect("/andaman");

  const destRes = await destinationsService.getBySlug(slug);
  if (!destRes.ok || !destRes.data) notFound();
  const dest = destRes.data;

  const [exactRes, regionRes] = await Promise.all([
    packagesService.list({ destination: dest.name }),
    packagesService.byRegion(dest.region, 6),
  ]);
  const exact = exactRes.ok ? exactRes.data : [];
  const tours = exact.length > 0 ? exact : (regionRes.ok ? regionRes.data : []);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    {
      label: dest.region === "international" ? "International" : "Domestic",
      href: dest.region === "international" ? "/packages/international" : "/packages/domestic",
    },
    { label: dest.name },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 -z-10">
          <Image src={dest.heroImage ?? dest.image} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/55 to-navy/95" />
        </div>
        <Container>
          <div className="pt-8">
            <Breadcrumb items={breadcrumbs} invert />
          </div>
          <div className="max-w-2xl pb-16 pt-8 sm:pb-24 sm:pt-12">
            <p className="text-label uppercase text-gold">{dest.continent ?? "Destination"}</p>
            <h1 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-tight tracking-tight text-balance">
              {dest.name}
            </h1>
            <p className="mt-3 text-[17px] text-white/75">{dest.tagline}</p>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/70">
              Our specialists know {dest.name} well — its hidden afternoons, its overrated postcards, and the
              properties worth the splurge. Below: a working shelf of journeys, plus a way to design your own.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href={`/contact?destination=${dest.slug}`} size="lg" className="px-7">Plan my {dest.name}</ButtonLink>
              <ButtonLink href="/guides" variant="outline-light" size="lg" className="px-7">Read our {dest.name} guides</ButtonLink>
            </div>
            <p className="mt-8 inline-flex items-center gap-2 text-[13px] text-white/60">
              Curated journeys from <span className="font-mono text-gold">{formatPriceShort(dest.startsFrom)}</span> per adult
            </p>
          </div>
        </Container>
      </section>

      <Section tone="cream" pad="default">
        <Container>
          <SectionHeader
            eyebrow={`${dest.name} journeys`}
            title={`${tours.length} curated route${tours.length === 1 ? "" : "s"} through ${dest.name}.`}
            description="Each itinerary is a starting point — yours will be rebuilt around how you travel."
            viewAllHref={dest.region === "international" ? "/packages/international" : "/packages/domestic"}
            viewAllLabel="Browse all"
          />
          <CardRail>
            {tours.map((t) => (
              <CardRailItem key={t.slug}>
                <PackageCard data={t} />
              </CardRailItem>
            ))}
          </CardRail>
        </Container>
      </Section>

      <ConciergeCTA
        title={`Looking for a more specific ${dest.name} trip?`}
        description="Tell us your dates and your pace — a written proposal lands in your inbox within four hours."
      />

      <JsonLd
        data={[
          breadcrumbJsonLd(breadcrumbs.map((b) => ({ name: b.label, url: b.href ?? `/destinations/${dest.slug}` }))),
          {
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            name: dest.name,
            description: dest.tagline,
            url: `${SITE.url}/destinations/${dest.slug}`,
          },
        ]}
      />
    </>
  );
}
