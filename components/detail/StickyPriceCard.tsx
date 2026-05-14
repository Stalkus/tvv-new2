"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { SITE } from "@/lib/seo";

interface Props {
  tourSlug: string;
  tourTitle: string;
  priceCurrent: number;
  priceOriginal?: number;
}

export function StickyPriceCard({ tourSlug, tourTitle, priceCurrent, priceOriginal }: Props) {
  const [pax, setPax] = useState(2);
  const saved = priceOriginal ? priceOriginal - priceCurrent : 0;
  const whatsappHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    `Hello TVV, I'd like a proposal for ${tourTitle} for ${pax} adult${pax > 1 ? "s" : ""}.`,
  )}`;

  return (
    <aside className="overflow-hidden rounded-[24px] border border-line/40 bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
      <div className="p-8 pb-6">
        {priceOriginal && (
          <p className="font-mono text-[13px] text-danger/80 line-through mb-1">{formatINR(priceOriginal)}</p>
        )}
        <p className="font-display text-[40px] leading-none tracking-tight text-ink">
          {formatINR(priceCurrent)}
          <span className="ml-2 align-baseline text-[13px] font-sans font-medium tracking-wide text-ink-muted uppercase">/ Adult</span>
        </p>
        {saved > 0 && (
          <p className="mt-3 inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal">
            Save {formatINR(saved)} per adult
          </p>
        )}
      </div>

      <div className="space-y-5 px-8 pb-8">
        <div className="rounded-xl border border-line/60 bg-white p-2">
          <label htmlFor="pax" className="block px-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-ink-muted">Travellers</label>
          <div className="flex h-10 items-center justify-between">
            <button
              type="button"
              onClick={() => setPax(Math.max(1, pax - 1))}
              className="flex h-full w-10 items-center justify-center text-ink-secondary transition-colors hover:text-ink"
              aria-label="Decrease travellers"
            >−</button>
            <span id="pax" className="font-mono text-[15px] font-medium text-ink">{pax}</span>
            <button
              type="button"
              onClick={() => setPax(Math.min(20, pax + 1))}
              className="flex h-full w-10 items-center justify-center text-ink-secondary transition-colors hover:text-ink"
              aria-label="Increase travellers"
            >+</button>
          </div>
        </div>

        <Link
          href={`/contact?tour=${tourSlug}&pax=${pax}`}
          className="group relative flex h-14 w-full items-center justify-center gap-2 rounded-full bg-teal px-6 text-[13px] font-bold uppercase tracking-widest text-white shadow-[0_8px_20px_rgba(14,99,92,0.2)] transition-all hover:-translate-y-0.5 hover:bg-teal-hover hover:shadow-[0_12px_24px_rgba(14,99,92,0.3)]"
        >
          Request a Proposal <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-line/80 bg-white text-[13px] font-bold uppercase tracking-widest text-ink transition-all hover:border-teal hover:text-teal hover:bg-teal/5"
        >
          <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp Us
        </a>
      </div>

      <div className="border-t border-line/40 bg-cream/50 p-6 space-y-3">
        <p className="flex items-start gap-3 text-[13px] font-medium text-ink-secondary">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden /> 
          <span className="leading-relaxed text-pretty">No charge until you approve a written proposal.</span>
        </p>
        <p className="flex items-start gap-3 text-[13px] font-medium text-ink-secondary">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden /> 
          <span className="leading-relaxed text-pretty">Specialist replies within four working hours.</span>
        </p>
        <p className="flex items-start gap-3 text-[13px] font-medium text-ink-secondary">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden /> 
          <span className="leading-relaxed text-pretty">24/7 dedicated concierge during travel.</span>
        </p>
      </div>
    </aside>
  );
}
