"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Award, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/SearchBar";

const heroImage =
  "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&w=2400&q=85";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-white">
      {/* Cinematic image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/70 to-navy/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/40 to-transparent" />
      </div>
      <div className="grain absolute inset-0 -z-10" aria-hidden />

      <div className="mx-auto max-w-[1400px] px-5 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32 lg:px-8 lg:pt-36 lg:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
            A specialist travel house · Est. 2008
          </span>

          <h1 className="mt-7 font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] tracking-tight text-white text-balance">
            Curated Global Journeys
            <span className="block text-gold">Powered by Andaman Experts</span>
          </h1>

          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/75 text-pretty">
            Specialist-led travel across the Andamans and to 65+ destinations worldwide. We design quietly,
            we plan precisely, and we remain reachable through every mile of your journey.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/contact" size="lg" className="px-7">
              Plan My Journey <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/andaman" variant="outline-light" size="lg" className="px-7">
              Explore Andaman
            </ButtonLink>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 0.61, 0.36, 1] }}
          className="mt-12 max-w-3xl"
        >
          <SearchBar placeholder="Search Andaman, Kerala, Japan, Maldives…" ctaLabel="Search" />
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-gold" aria-hidden /> 65+ destinations
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Award className="h-3 w-3 text-gold" aria-hidden /> 12,400+ journeys
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-gold" aria-hidden /> 24/7 specialist on-call
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
