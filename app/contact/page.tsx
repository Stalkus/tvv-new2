import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Section, SectionHeader } from "@/components/ui/Section";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { SITE, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Plan My Journey — Talk to a TVV Specialist",
  description:
    "Talk to a TVV travel specialist. Share your dates, your destination, and how you like to travel — we'll send a private proposal within four working hours.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <section className="bg-cream pt-10 pb-12">
        <Container>
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Plan my journey" }]} />
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr,1fr]">
            <div>
              <p className="text-label uppercase text-teal">Plan my journey</p>
              <h1 className="mt-3 font-display text-[clamp(2rem,4.5vw,3rem)] leading-[1.05] tracking-tight text-balance text-ink">
                Tell us how you travel.
                <span className="block text-teal/90">We'll do the rest, quietly.</span>
              </h1>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-secondary">
                A short form, a specialist who reads it carefully, and a written proposal in your inbox within
                four working hours. No call-centre, no script, no obligation.
              </p>

              <dl className="mt-10 grid gap-6 sm:grid-cols-2">
                <ContactRow
                  icon={Phone}
                  title="Talk to a specialist"
                  value={SITE.phone}
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  note="Mon–Sun · 9 am – 9 pm IST"
                />
                <ContactRow
                  icon={MessageCircle}
                  title="WhatsApp"
                  value="Quick replies, share dates"
                  href={`https://wa.me/${SITE.whatsapp}`}
                  note="Avg. response time: 10 min"
                />
                <ContactRow
                  icon={Mail}
                  title="Email"
                  value={SITE.email}
                  href={`mailto:${SITE.email}`}
                  note="For detailed briefs"
                />
                <ContactRow
                  icon={MapPin}
                  title="Offices"
                  value="Port Blair · Bengaluru · Mumbai"
                  note="By appointment"
                />
              </dl>

              <div className="mt-10 rounded-lg border border-line bg-white p-6">
                <p className="text-label uppercase text-teal">What happens next</p>
                <ol className="mt-4 space-y-3 text-[14px] text-ink-secondary">
                  <li><strong className="text-ink">1.</strong> A specialist reads your enquiry (a human, in India).</li>
                  <li><strong className="text-ink">2.</strong> You'll receive a written proposal within four working hours.</li>
                  <li><strong className="text-ink">3.</strong> We iterate — no pressure, no obligation.</li>
                  <li><strong className="text-ink">4.</strong> Once you approve, a 25% deposit confirms your trip.</li>
                </ol>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <EnquiryForm />
            </div>
          </div>
        </Container>
      </section>

      <Section tone="navy" pad="tight" className="overflow-hidden">
        <div className="grain absolute inset-0 pointer-events-none" aria-hidden />
        <Container>
          <p className="text-center text-[14px] text-white/70">
            For corporate or MICE travel of 12+ travellers, write to{" "}
            <a href="mailto:corporate@thevacationvoice.com" className="text-gold underline-offset-4 hover:underline">
              corporate@thevacationvoice.com
            </a>
          </p>
        </Container>
      </Section>
    </>
  );
}

function ContactRow({
  icon: Icon,
  title,
  value,
  href,
  note,
}: {
  icon: typeof Phone;
  title: string;
  value: string;
  href?: string;
  note?: string;
}) {
  const content = (
    <div className="flex items-start gap-4">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-light text-teal">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div>
        <dt className="text-label uppercase text-ink-muted">{title}</dt>
        <dd className="mt-1 text-[15px] font-medium text-ink">{value}</dd>
        {note && <p className="mt-0.5 text-[11px] text-ink-muted">{note}</p>}
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block rounded-md p-1 transition-colors hover:bg-surface">
      {content}
    </a>
  ) : (
    <div className="rounded-md p-1">{content}</div>
  );
}
