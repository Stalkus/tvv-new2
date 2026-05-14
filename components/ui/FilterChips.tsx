"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ChipOption {
  label: string;
  value: string;
}

interface FilterChipsProps {
  options: ChipOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function FilterChips({
  options,
  defaultValue,
  onChange,
  className,
  ariaLabel = "Filters",
}: FilterChipsProps) {
  const [active, setActive] = useState<string>(defaultValue ?? options[0]?.value ?? "");
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "flex w-full gap-2 overflow-x-auto scroll-rail py-1 -mx-1 px-1",
        className,
      )}
    >
      {options.map((o) => {
        const isActive = active === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              setActive(o.value);
              onChange?.(o.value);
            }}
            className={cn(
              "shrink-0 h-[34px] px-4 rounded-pill text-[12px] font-medium transition-colors duration-fast",
              isActive
                ? "bg-teal text-white"
                : "bg-white text-ink-secondary border border-line hover:bg-teal-light hover:text-teal hover:border-teal-light",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
