import { notFound } from "next/navigation";
import { Check, X, Star, Clock, MapPin, Users, Calendar } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Stars } from "@/components/ui/Stars";
import { TourGallery } from "@/components/detail/TourGallery";
import { StickyPriceCard } from "@/components/detail/StickyPriceCard";
import { ItineraryAccordion, generateItinerary } from "@/components/detail/ItineraryAccordion";
import { PackageCard } from "@/components/cards/PackageCard";
import { ConciergeCTA } from "@/components/sections/ConciergeCTA";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section, SectionHeader } from "@/components/ui/Section";
import { CardRail, CardRailItem } from "@/components/sections/CardRail";
import {
  faqsService,
  packagesService,
  reviewsService,
} from "@/lib/services";
import { manualPackages, tripjackPackages } from "@/lib/mock";
import { fromManual, fromTripJack } from "@/lib/adapters";
import { buildMetadata, tourJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { formatINR } from "@/lib/utils";

/**
 * Pre-generate routes for every known slug across BOTH sources (manual + vendor).
 * Adapters are deterministic, so slugs are stable build-to-build.
 */
export function generateStaticParams() {
  const manualSlugs = manualPackages.map((m) => fromManual(m).slug);
  const vendorSlugs = tripjackPackages.map((v) => fromTripJack(v).slug);
  return [...new Set([...manualSlugs, ...vendorSlugs])].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await packagesService.getBySlug(slug);
  if (!res.ok || !res.data) {
    return buildMetadata({ title: "Journey not found", description: "", path: `/tours/${slug}` });
  }
  const pkg = res.data;
  return buildMetadata({
    title: `${pkg.title} — ${pkg.durationDays}D/${pkg.durationNights}N`,
    description: `${pkg.title}. ${pkg.durationDays} days, ${pkg.durationNights} nights. Curated by TVV specialists. From ${formatINR(pkg.pricing.perAdult)} per adult.`,
    path: `/tours/${pkg.slug}`,
    image: pkg.hero.image,
    keywords: [pkg.destination, pkg.title, "TVV tour package", ...(pkg.themes ?? [])],
  });
}

export const revalidate = 600;

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [pkgRes, faqRes] = await Promise.all([
    packagesService.getBySlug(slug),
    faqsService.list(),
  ]);
  if (!pkgRes.ok) {
    // Treat any error as a not-found from the perspective of this route — error
    // boundaries cover real outages above.
    notFound();
  }
  const pkg = pkgRes.data;
  if (!pkg) notFound();

  const [relatedRes, reviewsRes] = await Promise.all([
    packagesService.getRelated(pkg.slug, 6),
    reviewsService.forTour(pkg.slug, 2),
  ]);
  const similar = relatedRes.ok ? relatedRes.data : [];
  const reviews = reviewsRes.ok ? reviewsRes.data : [];
  const faqs = faqRes.ok ? faqRes.data : [];

  const itineraryDays = pkg.itinerary && pkg.itinerary.length > 0
    ? pkg.itinerary
    : generateItinerary(pkg.destinations, pkg.highlights);

  const inclusions = pkg.inclusions ?? [
    "Hand-selected stays, vetted by our team",
    "Daily breakfast & curated dinners",
    "Private airport transfers",
    "Specialist concierge on call 24/7",
    "All ground transport on the itinerary",
  ];
  const exclusions = pkg.exclusions ?? [
    "International / domestic flights (quoted on request)",
    "Travel insurance & visas",
    "Personal expenses, tips",
    "Experiences not listed in inclusions",
  ];

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Packages", href: pkg.region === "international" ? "/packages/international" : "/packages/domestic" },
    { label: pkg.destination, href: `/destinations/${pkg.destination.toLowerCase().replace(/\s+/g, "-")}` },
    { label: pkg.title },
  ];

  return (
    <>
      {/* Header */}
      <section className="bg-cream pt-6 pb-10">
        <Container>
          <Breadcrumb items={breadcrumbs} />
          <div className="mt-6">
            <TourGallery alt={pkg.title} images={pkg.hero.gallery?.map((g) => g.url)} />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.7fr,1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {pkg.badges?.map((b) => (
                  <Badge
                    key={b}
                    tone={
                      b === "exclusive" ? "gold" :
                      b === "staff-pick" ? "gold" :
                      b === "flash-sale" ? "warn" :
                      b === "limited-seats" ? "danger" :
                      "info"
                    }
                  >
                    {b.replace("-", " ")}
                  </Badge>
                ))}
                {pkg.vendor.source === "tripjack" && (
                  <Badge tone="info">Vendor verified</Badge>
                )}
              </div>
              <h1 className="mt-4 font-display text-[clamp(1.875rem,3.6vw,2.625rem)] leading-[1.1] tracking-tight text-balance text-ink">
                {pkg.title}
              </h1>
              {pkg.subtitle && (
                <p className="mt-2 text-[15px] text-ink-secondary">{pkg.subtitle}</p>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-secondary">
                {typeof pkg.rating === "number" && (
                  <Stars value={pkg.rating} count={pkg.ratingCount} size="md" />
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-teal" aria-hidden /> {pkg.durationDays}D / {pkg.durationNights}N
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-teal" aria-hidden /> {pkg.destination}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-teal" aria-hidden /> Private departures
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-teal" aria-hidden /> Year-round, customised
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {pkg.destinations.map((d) => (
                  <span
                    key={`${d.days}-${d.city}`}
                    className="inline-flex items-center rounded-pill border border-line bg-white px-3 py-1 text-[12px] font-medium text-ink-secondary"
                  >
                    {d.days}D {d.city}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <StickyPriceCard
                tourSlug={pkg.slug}
                tourTitle={pkg.title}
                priceCurrent={pkg.pricing.perAdult}
                priceOriginal={pkg.pricing.originalPerAdult}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Body */}
      <section className="bg-cream pb-section">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.7fr,1fr]">
            <div className="space-y-16">
              <section>
                <h2 className="font-display text-[28px] text-ink">Overview</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-secondary">
                  {pkg.description ??
                    `${pkg.title} is a ${pkg.durationDays}-day, ${pkg.durationNights}-night journey through ${pkg.destination}, designed by a TVV specialist who knows the route. The itinerary balances movement with stillness — private experiences in the morning, room to breathe in the afternoon.`}
                </p>
                {pkg.highlights && pkg.highlights.length > 0 && (
                  <div className="mt-6 rounded-lg border border-line bg-white p-6">
                    <p className="text-label uppercase text-teal">Highlights</p>
                    <ul className="mt-4 space-y-3">
                      {pkg.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-3 text-[14px] text-ink">
                          <Star className="mt-0.5 h-4 w-4 shrink-0 fill-gold text-gold" strokeWidth={0} aria-hidden />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              <section id="itinerary">
                <div className="flex items-end justify-between gap-4">
                  <h2 className="font-display text-[28px] text-ink">Day-by-day itinerary</h2>
                  <p className="text-[12px] text-ink-muted">All days are fully customisable.</p>
                </div>
                <div className="mt-6">
                  <ItineraryAccordion days={itineraryDays} />
                </div>
              </section>

              <section>
                <h2 className="font-display text-[28px] text-ink">What's included</h2>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="rounded-lg border border-line bg-white p-6">
                    <p className="text-label uppercase text-success">Included</p>
                    <ul className="mt-4 space-y-3">
                      {inclusions.map((i, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-[14px] text-ink-secondary">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-line bg-white p-6">
                    <p className="text-label uppercase text-danger">Not included</p>
                    <ul className="mt-4 space-y-3">
                      {exclusions.map((i, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-[14px] text-ink-secondary">
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden />
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {pkg.policy?.cancellation && (
                  <p className="mt-4 text-[12px] text-ink-muted">
                    <span className="font-medium text-ink-secondary">Cancellation:</span> {pkg.policy.cancellation}
                  </p>
                )}
              </section>

              {reviews.length > 0 && (
                <section>
                  <h2 className="font-display text-[28px] text-ink">Travellers, on this journey</h2>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    {reviews.map((r) => (
                      <figure key={r.name} className="rounded-lg border border-line bg-white p-6">
                        <Stars value={r.rating} />
                        <p className="mt-3 font-display text-[17px] text-ink">{r.title}</p>
                        <blockquote className="mt-2 text-[14px] leading-relaxed text-ink-secondary">"{r.body}"</blockquote>
                        <figcaption className="mt-4 text-[12px] text-ink-muted">
                          {r.name} · {r.location} · {r.date}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              )}

              {faqs.length > 0 && (
                <section>
                  <h2 className="font-display text-[28px] text-ink">Common questions</h2>
                  <div className="mt-6 divide-y divide-line rounded-lg border border-line bg-white">
                    {faqs.slice(0, 4).map((f, i) => (
                      <details key={i} className="group">
                        <summary className="flex cursor-pointer items-center justify-between gap-5 px-6 py-5 [&::-webkit-details-marker]:hidden">
                          <h3 className="font-display text-[16px] text-ink">{f.q}</h3>
                          <span
                            aria-hidden
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-ink-muted transition-transform duration-base group-open:rotate-45"
                          >+</span>
                        </summary>
                        <p className="px-6 pb-5 text-[14px] leading-relaxed text-ink-secondary">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="hidden lg:block" />
          </div>
        </Container>
      </section>

      {similar.length > 0 && (
        <Section tone="white" pad="default">
          <Container>
            <SectionHeader
              eyebrow="You might also like"
              title="Similar journeys, curated for you."
              viewAllHref={pkg.region === "international" ? "/packages/international" : "/packages/domestic"}
              viewAllLabel="Browse more"
            />
            <CardRail>
              {similar.map((p) => (
                <CardRailItem key={p.slug}>
                  <PackageCard data={p} />
                </CardRailItem>
              ))}
            </CardRail>
          </Container>
        </Section>
      )}

      <ConciergeCTA
        title="Want this journey, but in your own shape?"
        description="A specialist will rebuild this itinerary around your dates, party size, and pace. Same care, same shelf — your route."
      />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[18px] font-bold text-teal">{formatINR(pkg.pricing.perAdult)}</p>
            <p className="text-[10px] text-ink-muted">per adult · all-inclusive</p>
          </div>
          <a
            href={`/contact?tour=${pkg.slug}`}
            className="inline-flex h-11 items-center justify-center rounded-md bg-teal px-6 text-[14px] font-medium text-white hover:bg-teal-hover"
          >
            Request a callback
          </a>
        </div>
      </div>

      <JsonLd
        data={[
          tourJsonLd({
            title: pkg.title,
            description: pkg.description ?? `${pkg.title}. ${pkg.durationDays} days, ${pkg.durationNights} nights through ${pkg.destination}.`,
            image: pkg.hero.image,
            priceCurrent: pkg.pricing.perAdult,
            durationDays: pkg.durationDays,
            destination: pkg.destination,
            slug: pkg.slug,
            rating: pkg.rating ?? 4.8,
            ratingCount: pkg.ratingCount ?? 0,
          }),
          breadcrumbJsonLd(breadcrumbs.map((b) => ({ name: b.label, url: b.href ?? `/tours/${pkg.slug}` }))),
          ...(faqs.length > 0 ? [faqJsonLd(faqs.slice(0, 4))] : []),
        ]}
      />
    </>
  );
}
