import Image from "next/image";
import Link from "next/link";
import type { AndamanTileItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  item: AndamanTileItem;
  variant?: "default" | "feature";
  className?: string;
}

export function AndamanTile({ item, variant = "default", className }: Props) {
  const isFeature = variant === "feature";
  return (
    <Link
      href={item.href}
      className={cn(
        "group relative block overflow-hidden rounded-lg bg-navy",
        isFeature ? "aspect-[5/6] sm:aspect-[4/5]" : "aspect-[4/5]",
        className,
      )}
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes="(min-width: 1024px) 33vw, 80vw"
        className="object-cover transition-transform duration-[800ms] ease-premium group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {item.meta && (
        <span className="absolute right-4 top-4 inline-flex items-center rounded-sm bg-white/15 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-white backdrop-blur-sm">
          {item.meta}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-gold">Andaman · TVV signature</p>
        <h3 className={cn("font-display text-white", isFeature ? "text-[26px] leading-tight" : "text-[20px] leading-tight")}>
          {item.title}
        </h3>
        <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-white/80">
          {item.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-white">
          Explore
          <span aria-hidden className="transition-transform duration-base group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}
