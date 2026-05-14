import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/lib/types";
import { cn, formatPriceShort } from "@/lib/utils";

interface Props {
  destination: Destination;
  variant?: "compact" | "tall" | "wide";
  className?: string;
  priority?: boolean;
}

export function DestinationCard({ destination, variant = "tall", className, priority }: Props) {
  const href = destination.slug === "andaman" ? "/andaman" : `/destinations/${destination.slug}`;
  const ratio =
    variant === "compact" ? "aspect-[4/5]" : variant === "wide" ? "aspect-[5/4]" : "aspect-[3/4]";
  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden rounded-lg bg-navy",
        ratio,
        className,
      )}
    >
      <Image
        src={destination.image}
        alt={destination.name}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 70vw"
        priority={priority}
        className="object-cover transition-transform duration-[700ms] ease-premium group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-[10px] uppercase tracking-[0.14em] text-white/70">{destination.continent ?? "Destination"}</p>
        <h3 className="mt-1 font-display text-[22px] leading-tight text-white">
          {destination.name}
        </h3>
        <p className="mt-0.5 text-[12px] text-white/75">{destination.tagline}</p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-gold">
          From {formatPriceShort(destination.startsFrom)} <span aria-hidden>→</span>
        </p>
      </div>
    </Link>
  );
}
