import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Horizontal scroll rail used for tour-card carousels on all hub pages.
 * Mobile = native scroll; desktop = grid.
 */
export function CardRail({
  children,
  className,
  asGrid = true,
}: {
  children: ReactNode;
  className?: string;
  asGrid?: boolean;
}) {
  return (
    <div
      className={cn(
        "-mx-5 flex gap-5 overflow-x-auto scroll-rail scroll-snap-x px-5 pb-3",
        asGrid && "sm:mx-0 sm:overflow-visible sm:px-0 sm:grid sm:grid-cols-2 sm:scroll-snap-none lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardRailItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-[280px] shrink-0 scroll-snap-start sm:w-auto", className)}>
      {children}
    </div>
  );
}
