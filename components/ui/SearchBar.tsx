"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
  ctaLabel?: string;
  size?: "hero" | "inline";
  className?: string;
}

export function SearchBar({
  placeholder = "Search destinations, journeys, experiences…",
  ctaLabel = "Explore",
  size = "hero",
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const isHero = size === "hero";

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "group flex w-full items-center gap-2 rounded-pill bg-white shadow-hover transition-all duration-base focus-within:ring-2 focus-within:ring-teal/40",
        isHero ? "h-[60px] sm:h-[64px] pl-5 pr-1.5" : "h-12 pl-4 pr-1",
        className,
      )}
      role="search"
      aria-label="Search The Vacation Voice"
    >
      <Search className="h-5 w-5 shrink-0 text-ink-muted" strokeWidth={1.75} aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "flex-1 bg-transparent text-ink placeholder:text-ink-muted outline-none",
          isHero ? "text-[15px] sm:text-base" : "text-sm",
        )}
        aria-label="Search query"
      />
      <button
        type="submit"
        className={cn(
          "shrink-0 rounded-pill bg-teal font-medium text-white transition-colors duration-fast hover:bg-teal-hover",
          isHero ? "h-12 px-6 text-sm sm:text-[15px]" : "h-10 px-5 text-[13px]",
        )}
      >
        {ctaLabel}
      </button>
    </form>
  );
}
