import Image from "next/image";
import Link from "next/link";
import { Compass, Heart, Gem, Leaf, Users, Waves, Utensils, Landmark } from "lucide-react";
import type { Experience } from "@/lib/types";
import { cn } from "@/lib/utils";

const iconMap = {
  compass: Compass,
  heart: Heart,
  gem: Gem,
  leaf: Leaf,
  users: Users,
  waves: Waves,
  utensils: Utensils,
  landmark: Landmark,
} as const;

interface Props {
  experience: Experience;
  className?: string;
}

export function ExperienceCard({ experience, className }: Props) {
  const Icon = (iconMap as Record<string, typeof Compass>)[experience.icon] ?? Compass;
  return (
    <Link
      href={`/experiences/${experience.slug}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white p-6 transition-all duration-base hover:-translate-y-0.5 hover:border-teal/30 hover:shadow-hover",
        className,
      )}
    >
      <div className="relative -mx-6 -mt-6 mb-5 aspect-[5/3] overflow-hidden">
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition-transform duration-[600ms] ease-premium group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-teal shadow-card">
          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
      </div>
      <h3 className="font-display text-[20px] leading-tight text-ink">{experience.title}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-secondary">{experience.description}</p>
      <div className="mt-auto pt-4 flex items-center justify-between">
        {typeof experience.count === "number" && (
          <span className="text-[12px] text-ink-muted">{experience.count} journeys</span>
        )}
        <span className="inline-flex items-center gap-1 text-[12px] font-medium text-teal">
          Explore <span aria-hidden className="transition-transform duration-base group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}
