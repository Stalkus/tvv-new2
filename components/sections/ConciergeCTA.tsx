import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

interface Props {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  image?: string;
}

export function ConciergeCTA({
  eyebrow = "Concierge",
  title = "Can't find quite the journey you're imagining?",
  description = "Our specialists design private itineraries from scratch — dates, pace, party size, and whatever else makes the trip yours. Most proposals are sent within four working hours.",
  primaryLabel = "Talk to a Specialist",
  primaryHref = "/contact",
  secondaryLabel = "Request a private consultation",
  secondaryHref = "/contact?type=consultation",
  image = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1800&q=85",
}: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-white">
      <div className="absolute inset-0 -z-10">
        <Image src={image} alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/80" />
      </div>
      <div className="grain absolute inset-0 -z-10" aria-hidden />
      <Container>
        <div className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.4fr,1fr] lg:items-center lg:py-24">
          <div>
            <p className="mb-3 text-label uppercase text-gold">{eyebrow}</p>
            <h2 className="font-display text-[clamp(1.75rem,3.6vw,2.5rem)] leading-tight tracking-tight text-balance">
              {title}
            </h2>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-white/75 text-pretty">
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:items-end">
            <ButtonLink href={primaryHref} size="lg" className="px-7 w-full lg:w-auto">
              {primaryLabel}
            </ButtonLink>
            <ButtonLink href={secondaryHref} variant="outline-light" size="lg" className="px-7 w-full lg:w-auto">
              {secondaryLabel}
            </ButtonLink>
            <p className="text-[12px] text-white/55">No obligation · No call-centre · Replies in &lt; 4 hours</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
