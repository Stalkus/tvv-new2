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
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
          className="absolute left-1/2 top-full z-50 mt-1 w-[min(1080px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-xl border border-line bg-white shadow-modal"
          role="region"
          aria-label={`${group.label} menu`}
        >
          <div className="grid grid-cols-3 gap-10 p-8">
            {group.mega.columns.map((col) => (
              <div key={col.title}>
                <p className="mb-4 text-label uppercase text-teal">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-start justify-between gap-3 rounded-md py-1 text-[14px] text-ink hover:text-teal"
                      >
                        <span>{link.label}</span>
                        {link.meta && (
                          <span className="shrink-0 text-[11px] text-ink-muted">{link.meta}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {group.mega.picks && (
            <div className="border-t border-line bg-teal-light/40 px-8 py-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-label uppercase text-teal">Top picks</span>
                <span className="editorial-rule flex-1 max-w-[120px]" aria-hidden />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {group.mega.picks.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-md bg-white p-2.5 transition-shadow hover:shadow-card",
                    )}
                  >
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-sm">
                      <Image src={p.image} alt="" fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-ink group-hover:text-teal">
                        {p.label}
                      </p>
                      <p className="text-[11px] text-ink-muted">from {p.priceFrom}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
