"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { NavGroup } from "./nav-data";
import { cn } from "@/lib/utils";

interface Props {
  group: NavGroup;
  open: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function MegaMenu({ group, open, onMouseEnter, onMouseLeave }: Props) {
  if (!group.mega) return null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
          className="absolute left-1/2 top-[calc(100%+16px)] z-50 w-[min(1100px,calc(100vw-48px))] -translate-x-1/2 overflow-hidden rounded-[24px] border border-white/20 bg-white/95 backdrop-blur-3xl shadow-[0_24px_64px_rgba(0,0,0,0.12)]"
          role="region"
          aria-label={`${group.label} menu`}
        >
          <div className="flex flex-col lg:flex-row">
            {/* Columns Section */}
            <div className="flex-1 p-10 lg:p-12">
              <div className="grid grid-cols-3 gap-12">
                {group.mega.columns.map((col) => (
                  <div key={col.title}>
                    <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.15em] text-ink-muted/80">{col.title}</p>
                    <ul className="space-y-4">
                      {col.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="group flex items-start justify-between gap-3 text-[15px] font-medium text-ink transition-colors hover:text-teal"
                          >
                            <span>{link.label}</span>
                            {link.meta && (
                              <span className="shrink-0 text-[10px] font-semibold tracking-wider text-ink-muted/50 uppercase">{link.meta}</span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Picks Section */}
            {group.mega.picks && (
              <div className="w-full lg:w-[400px] shrink-0 border-t lg:border-l lg:border-t-0 border-line bg-surface/40 p-10 lg:p-12">
                <div className="mb-6 flex items-center gap-4">
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-muted/80">Curated Picks</span>
                  <span className="h-[1px] flex-1 bg-line/80" aria-hidden />
                </div>
                <div className="flex flex-col gap-6">
                  {group.mega.picks.map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      className="group flex items-center gap-4 transition-all duration-500 hover:-translate-y-0.5"
                    >
                      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-shadow duration-500 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]">
                        <Image src={p.image} alt="" fill className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-110" sizes="80px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-ink transition-colors duration-300 group-hover:text-teal">
                          {p.label}
                        </p>
                        <p className="mt-1 text-[12px] font-medium text-ink-muted">from <span className="text-teal font-semibold">{p.priceFrom}</span></p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
