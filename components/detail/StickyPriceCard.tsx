"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, Phone, ShieldCheck, ArrowRight } from "lucide-react";
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
    <aside className="overflow-hidden rounded-xl border border-line bg-white shadow-card">
      <div className="border-b border-line p-6">
        {priceOriginal && (
          <p className="font-mono text-[13px] text-danger line-through">{formatINR(priceOriginal)}</p>
        )}
        <p className="font-mono text-[28px] font-bold leading-none text-teal">
          {formatINR(priceCurrent)}
          <span className="ml-1.5 align-baseline text-[12px] font-normal text-ink-muted">/Adult</span>
        </p>
        {saved > 0 && (
          <p className="mt-2 inline-flex items-center rounded-sm bg-success-bg px-2 py-0.5 text-[11px] font-medium text-success">
            save {formatINR(saved)} per adult
          </p>
        )}
      </div>

      <div className="space-y-4 p-6">
        <div>
          <label htmlFor="pax" className="mb-2 block text-label uppercase text-ink-secondary">Travellers</label>
          <div className="inline-flex h-10 items-center rounded-md border border-line bg-white">
            <button
              type="button"
              onClick={() => setPax(Math.max(1, pax - 1))}
              className="h-full w-10 text-ink-secondary hover:bg-surface"
              aria-label="Decrease travellers"
            >−</button>
            <span id="pax" className="w-12 text-center font-mono text-[14px]">{pax}</span>
            <button
              type="button"
              onClick={() => setPax(Math.min(20, pax + 1))}
              className="h-full w-10 text-ink-secondary hover:bg-surface"
              aria-label="Increase travellers"
            >+</button>
          </div>
        </div>

        <Link
          href={`/contact?tour=${tourSlug}&pax=${pax}`}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-teal px-5 text-[14px] font-medium text-white transition-colors hover:bg-teal-hover"
        >
          Request a callback <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-line bg-white text-[14px] font-medium text-ink transition-colors hover:border-teal hover:text-teal"
        >
          <MessageCircle className="h-4 w-4" aria-hidden /> Enquire via WhatsApp
        </a>
        <a
          href={`tel:${SITE.phone.replace(/\s/g, "")}`}
          className="inline-flex h-10 w-full items-center justify-center gap-2 text-[13px] font-medium text-teal hover:text-teal-hover"
        >
          <Phone className="h-3.5 w-3.5" aria-hidden /> Or call {SITE.phone}
        </a>
      </div>

      <div className="space-y-2.5 border-t border-line bg-surface p-5 text-[12px] text-ink-secondary">
        <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-teal" aria-hidden /> No charge until you approve a written proposal.</p>
        <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-teal" aria-hidden /> Specialist replies within four working hours.</p>
        <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 text-teal" aria-hidden /> 24/7 concierge through your trip.</p>
      </div>
    </aside>
  );
}
