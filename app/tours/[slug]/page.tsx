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
import { FadeUp, FadeUpItem } from "@/components/ui/FadeUp";
import {
  faqsService,
  packagesService,
  reviewsService,
} from "@/lib/services";
import { manualPackages, tripjackPackages } from "@/lib/mock";
import { fromManual, fromTripJack } from "@/lib/adapters";
import { buildMetadata, tourJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { formatINR } from "@/lib/utils";

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
  if (!pkgRes.ok) notFound();
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
      <section className="bg-cream pt-28 pb-12 lg:pt-32 lg:pb-24">
        <Container>
          <Breadcrumb items={breadcrumbs} />
          <div className="mt-8 lg:mt-12">
            <TourGallery alt={pkg.title} images={pkg.hero.gallery?.map((g) => g.url)} />
          </div>

          <div className="mt-12 grid gap-12 lg:mt-20 lg:grid-cols-[1.6fr,1fr] xl:grid-cols-[1.8fr,1fr]">
            <FadeUp stagger>
              <FadeUpItem>
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
              </FadeUpItem>
              <FadeUpItem>
                <h1 className="mt-5 font-display text-[clamp(2.5rem,4.5vw,4rem)] leading-[1.05] tracking-tight text-balance text-ink">
                  {pkg.title}
                </h1>
              </FadeUpItem>
              <FadeUpItem>
                {pkg.subtitle && (
                  <p className="mt-4 text-[18px] leading-relaxed text-ink-secondary text-pretty">{pkg.subtitle}</p>
                )}
              </FadeUpItem>
              <FadeUpItem>
                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-[16px] bg-white/50 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-line/40 text-[14px] font-medium text-ink-secondary">
                  {typeof pkg.rating === "number" && (
                    <Stars value={pkg.rating} count={pkg.ratingCount} size="md" />
                  )}
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4 text-teal" aria-hidden /> {pkg.durationDays}D / {pkg.durationNights}N
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-teal" aria-hidden /> {pkg.destination}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4 text-teal" aria-hidden /> Private departures
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-teal" aria-hidden /> Year-round, customised
                  </span>
                </div>
              </FadeUpItem>
              <FadeUpItem>
                <div className="mt-6 flex flex-wrap gap-2">
                  {pkg.destinations.map((d) => (
                    <span
                      key={`${d.days}-${d.city}`}
                      className="inline-flex items-center rounded-full bg-teal/5 px-4 py-1.5 text-[12px] font-bold uppercase tracking-widest text-teal"
                    >
                      {d.days}D {d.city}
                    </span>
                  ))}
                </div>
              </FadeUpItem>
            </FadeUp>

            <div className="lg:sticky lg:top-32 lg:self-start hidden lg:block">
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

      <section className="bg-cream pb-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.6fr,1fr] xl:grid-cols-[1.8fr,1fr]">
            <div className="space-y-24">
              <section>
                <h2 className="font-display text-[32px] text-ink">Overview</h2>
                <p className="mt-6 text-[18px] leading-[1.9] text-ink-secondary text-pretty">
                  {pkg.description ??
                    `${pkg.title} is a ${pkg.durationDays}-day, ${pkg.durationNights}-night journey through ${pkg.destination}, designed by a TVV specialist who knows the route. The itinerary balances movement with stillness — private experiences in the morning, room to breathe in the afternoon.`}
                </p>
                {pkg.highlights && pkg.highlights.length > 0 && (
                  <div className="mt-8 rounded-[24px] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-line/40">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-teal">Highlights</p>
                    <ul className="mt-5 space-y-4">
                      {pkg.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-4 text-[16px] text-ink-secondary">
                          <Star className="mt-1 h-4 w-4 shrink-0 fill-gold text-gold" strokeWidth={0} aria-hidden />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              <section id="itinerary">
                <div className="flex items-end justify-between gap-4 border-b border-line/40 pb-4">
                  <h2 className="font-display text-[32px] text-ink">Day-by-day itinerary</h2>
                  <p className="text-[12px] font-medium uppercase tracking-widest text-ink-muted">Fully customisable</p>
                </div>
                <div className="mt-0">
                  <ItineraryAccordion days={itineraryDays} />
                </div>
              </section>

              <section>
                <h2 className="font-display text-[32px] text-ink">What's included</h2>
                <div className="mt-8 grid gap-8 sm:grid-cols-2">
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-success">Included</p>
                    <ul className="mt-5 space-y-4">
                      {inclusions.map((i, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-secondary">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-success" aria-hidden />
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-danger/70">Not included</p>
                    <ul className="mt-5 space-y-4">
                      {exclusions.map((i, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-secondary">
                          <X className="mt-1 h-4 w-4 shrink-0 text-danger/60" aria-hidden />
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {pkg.policy?.cancellation && (
                  <p className="mt-10 rounded-[16px] bg-white/50 p-6 text-[13px] leading-relaxed text-ink-secondary border border-line/40">
                    <span className="font-bold text-ink">Cancellation Policy:</span> {pkg.policy.cancellation}
                  </p>
                )}
              </section>

              {reviews.length > 0 && (
                <section>
                  <h2 className="font-display text-[32px] text-ink">Travellers on this journey</h2>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    {reviews.map((r) => (
                      <figure key={r.name} className="flex flex-col rounded-[24px] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-line/40">
                        <Stars value={r.rating} />
                        <p className="mt-5 font-display text-[20px] leading-snug text-ink">{r.title}</p>
                        <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-secondary">"{r.body}"</blockquote>
                        <figcaption className="mt-6 border-t border-line/40 pt-4 text-[12px] font-medium tracking-wide text-ink-muted">
                          {r.name} · {r.location} · {r.date}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              )}

              {faqs.length > 0 && (
                <section>
                  <h2 className="font-display text-[32px] text-ink">Common questions</h2>
                  <div className="mt-8 border-t border-line/40">
                    {faqs.slice(0, 4).map((f, i) => (
                      <details key={i} className="group border-b border-line/40 transition-colors hover:bg-white/40">
                        <summary className="flex cursor-pointer items-start justify-between gap-6 py-6 px-2 lg:px-4 [&::-webkit-details-marker]:hidden">
                          <h3 className="font-display text-[18px] text-ink">{f.q}</h3>
                          <span
                            aria-hidden
                            className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line/60 text-[18px] leading-none text-ink-muted transition-transform duration-300 group-open:rotate-45"
                          >+</span>
                        </summary>
                        <p className="px-2 pb-8 pt-2 text-[15px] leading-relaxed text-ink-secondary lg:px-4">{f.a}</p>
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
        <Section tone="white" className="py-24">
          <Container>
            <SectionHeader
              eyebrow="You might also like"
              title="Similar journeys, curated for you."
              viewAllHref={pkg.region === "international" ? "/packages/international" : "/packages/domestic"}
              viewAllLabel="Browse more"
            />
            <div className="mt-12">
              <CardRail>
                {similar.map((p) => (
                  <CardRailItem key={p.slug}>
                    <PackageCard data={p} />
                  </CardRailItem>
                ))}
              </CardRail>
            </div>
          </Container>
        </Section>
      )}

      <ConciergeCTA
        title="Want this journey, but in your own shape?"
        description="A specialist will rebuild this itinerary around your dates, party size, and pace. Same care, same shelf — your route."
      />

      {/* Floating Mobile Sticky CTA */}
      <div className="fixed inset-x-4 bottom-4 z-40 lg:hidden">
        <div className="flex items-center justify-between gap-4 rounded-full border border-white/20 bg-white/90 p-2 pl-6 shadow-[0_10px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl">
          <div>
            <p className="font-mono text-[20px] font-bold leading-none text-teal">{formatINR(pkg.pricing.perAdult)}</p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-muted">per adult</p>
          </div>
          <a
            href={`/contact?tour=${pkg.slug}`}
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-teal px-6 text-[13px] font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-teal-hover"
          >
            Get Proposal
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
