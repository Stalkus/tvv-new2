"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { navGroups } from "./nav-data";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10 lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-navy text-white lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <div className="flex h-14 items-center justify-between border-b border-white/10 px-5">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/10"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="h-[calc(100vh-3.5rem)] overflow-y-auto pb-32">
              <ul className="px-3 py-2">
                {navGroups.map((g) => {
                  const hasChildren = !!g.mega;
                  const isOpen = expanded === g.label;
                  return (
                    <li key={g.label} className="border-b border-white/5">
                      <div className="flex items-center">
                        <Link
                          href={g.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex-1 px-3 py-4 text-[16px] font-medium",
                            g.label === "Andaman" ? "text-gold" : "text-white",
                          )}
                        >
                          {g.label}
                        </Link>
                        {hasChildren && (
                          <button
                            onClick={() => setExpanded(isOpen ? null : g.label)}
                            aria-label={`Toggle ${g.label} submenu`}
                            aria-expanded={isOpen}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-white/10"
                          >
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-base",
                                isOpen && "rotate-180",
                              )}
                              aria-hidden
                            />
                          </button>
                        )}
                      </div>
                      <AnimatePresence>
                        {isOpen && g.mega && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-5 px-3 pb-5">
                              {g.mega.columns.map((col) => (
                                <div key={col.title}>
                                  <p className="mb-2 text-label uppercase text-gold/80">
                                    {col.title}
                                  </p>
                                  <ul className="space-y-1">
                                    {col.links.map((link) => (
                                      <li key={link.href}>
                                        <Link
                                          href={link.href}
                                          onClick={() => setOpen(false)}
                                          className="block py-2 text-[14px] text-white/80 hover:text-white"
                                        >
                                          {link.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>

              <div className="space-y-3 px-5 pt-6">
                <ButtonLink href="/contact" fullWidth size="lg">
                  Plan My Journey
                </ButtonLink>
                <ButtonLink href="/contact" variant="outline-light" fullWidth size="lg">
                  Talk to a Specialist
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
