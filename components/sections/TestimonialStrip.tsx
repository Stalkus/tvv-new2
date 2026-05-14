import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Stars } from "@/components/ui/Stars";
import type { Review } from "@/lib/models";

interface TestimonialStripProps {
  reviews: Review[];
  eyebrow?: string;
  title?: string;
  description?: string;
}

export function TestimonialStrip({
  reviews,
  eyebrow = "Travellers, on us",
  title = "A reputation built on the smallest details.",
  description = "What real travellers wrote when they came home. Verified reviews only.",
}: TestimonialStripProps) {
  if (!reviews || reviews.length === 0) return null;
  return (
    <Section tone="surface" pad="default">
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        <div className="grid gap-6 lg:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="flex h-full flex-col rounded-lg border border-line bg-white p-7 shadow-card"
            >
              <Quote className="h-5 w-5 text-gold" aria-hidden />
              <Stars value={r.rating} className="mt-3" />
              <p className="mt-4 font-display text-[18px] leading-snug text-ink">{r.title}</p>
              <blockquote className="mt-3 text-[14px] leading-relaxed text-ink-secondary">
                "{r.body}"
              </blockquote>
              <figcaption className="mt-6 border-t border-line pt-4">
                <p className="text-[13px] font-semibold text-ink">{r.name}</p>
                <p className="text-[11px] text-ink-muted">
                  {r.location} · {r.date}
                  {r.tour && ` · ${r.tour}`}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}
