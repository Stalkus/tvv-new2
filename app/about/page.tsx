import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ConciergeCTA } from "@/components/sections/ConciergeCTA";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About TVV — A Specialist Travel House",
  description:
    "The Vacation Voice is a specialist travel house founded in the Andamans, designing curated journeys across India and to 65+ destinations worldwide.",
  path: "/about",
});

const principles = [
  {
    title: "Specialist first, marketplace never",
    body: "Every journey is designed by a destination specialist who has walked the route. We don't resell off-the-shelf inventory or run an algorithm over your enquiry.",
  },
  {
    title: "Properties we'd send our own family to",
    body: "Every villa, ryokan, and estate in our portfolio has been visited by our team. If we wouldn't book it for ourselves, we won't book it for you.",
  },
  {
    title: "Quiet, considered service",
    body: "Service that's felt, not announced. The smallest details — anniversaries, allergies, the wine you mentioned twice — handled before you arrive.",
  },
  {
    title: "Reachable through the trip",
    body: "Every TVV traveller has a specialist on WhatsApp, twenty-four hours, seven days, in case the smallest thing needs solving.",
  },
];

const milestones = [
  { year: "2008", text: "Founded in Port Blair as an Andaman-only specialist." },
  { year: "2012", text: "Expanded to Kerala and Rajasthan with on-the-ground partner teams." },
  { year: "2018", text: "International desk opens — Maldives, Bali, Europe, Japan." },
  { year: "2022", text: "Corporate / MICE division launched. 4,000+ delegates moved." },
  { year: "2026", text: "12,400+ journeys curated. 65+ destinations covered. Andaman remains home." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=2400&q=85"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 to-navy" />
        </div>
        <Container>
          <div className="pt-8">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About" }]} invert />
          </div>
          <div className="max-w-3xl pb-24 pt-10 sm:pb-28 sm:pt-16">
            <p className="text-label uppercase text-gold">About TVV</p>
            <h1 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-tight tracking-tight text-balance">
              A small house. <span className="block text-gold/90">Carefully run.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/75">
              The Vacation Voice was founded in 2008 as an Andaman-only travel specialist. Eighteen years later,
              we curate journeys across India and to 65+ destinations worldwide — and the Andamans is still home.
            </p>
          </div>
        </Container>
      </section>

      <Section tone="cream" pad="default">
        <Container size="default">
          <SectionHeader
            eyebrow="The TVV way"
            title="Four principles, in practice."
            align="center"
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="rounded-lg border border-line bg-white p-7">
                <h3 className="font-display text-[20px] text-ink">{p.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-secondary">{p.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="white" pad="default">
        <Container size="default">
          <SectionHeader eyebrow="Our story" title="Eighteen years on the road." />
          <ol className="relative mt-10 space-y-10 border-l border-line pl-8">
            {milestones.map((m) => (
              <li key={m.year} className="relative">
                <span className="absolute -left-[2.1rem] top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-cream bg-teal" aria-hidden />
                <p className="font-mono text-[13px] font-semibold text-teal">{m.year}</p>
                <p className="mt-1 font-display text-[18px] leading-snug text-ink">{m.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="surface" pad="default" id="careers">
        <Container size="default">
          <SectionHeader
            eyebrow="Careers"
            title="We're a small team. We hire slowly."
            description="If you've travelled deeply, write clearly, and want to design journeys for a living — we'd like to hear from you."
          />
          <a
            href="mailto:careers@thevacationvoice.com"
            className="inline-flex h-11 items-center justify-center rounded-md bg-teal px-6 text-[14px] font-medium text-white hover:bg-teal-hover"
          >
            careers@thevacationvoice.com
          </a>
        </Container>
      </Section>

      <ConciergeCTA />
    </>
  );
}
