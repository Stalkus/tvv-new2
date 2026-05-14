"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { navGroups } from "./nav-data";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { ButtonLink } from "@/components/ui/Button";
import { SITE } from "@/lib/seo";

export function Navbar() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenKey(null), 120);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }
  function openMenu(key: string) {
    cancelClose();
    setOpenKey(key);
  }

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  return (
    <header className="sticky top-0 z-40 bg-navy text-white shadow-nav">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-5 sm:px-6 lg:px-8">
        <Logo />

        <nav className="ml-4 hidden flex-1 lg:flex" aria-label="Primary">
          <ul className="flex items-center gap-1">
            {navGroups.map((g) => {
              const hasMega = !!g.mega;
              const isActive = openKey === g.label;
              return (
                <li
                  key={g.label}
                  className="relative"
                  onMouseEnter={() => hasMega && openMenu(g.label)}
                  onMouseLeave={scheduleClose}
                >
                  <Link
                    href={g.href}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-3 py-2 text-[14px] font-medium transition-colors",
                      "text-white/90 hover:bg-white/[0.08] hover:text-white",
                      isActive && "text-white bg-white/[0.06]",
                      g.label === "Andaman" && "text-gold hover:text-gold/90",
                    )}
                    onFocus={() => hasMega && openMenu(g.label)}
                  >
                    {g.label}
                    {hasMega && (
                      <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
                    )}
                  </Link>
                  {hasMega && (
                    <MegaMenu
                      group={g}
                      open={isActive}
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href={`tel:${SITE.phone.replace(/\s/g, "")}`}
            className="hidden items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-white/70 hover:text-white sm:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden />
            <span>Talk to a specialist</span>
          </a>
          <ButtonLink
            href="/contact"
            variant="outline-light"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Enquire
          </ButtonLink>
          <ButtonLink href="/contact" size="sm" className="hidden lg:inline-flex">
            Plan My Journey
          </ButtonLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
