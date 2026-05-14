import Image from "next/image";
import Link from "next/link";
import type { Guide } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  guide: Guide;
  variant?: "default" | "feature";
  className?: string;
}

export function GuideCard({ guide, variant = "default", className }: Props) {
  const isFeature = variant === "feature";
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className={cn(
        "group block overflow-hidden rounded-lg",
        isFeature ? "bg-white border border-line shadow-card" : "",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden", isFeature ? "aspect-[16/9]" : "aspect-[5/3] rounded-lg")}>
        <Image
          src={guide.image}
          alt={guide.title}
          fill
          sizes="(min-width: 1024px) 33vw, 90vw"
          className="object-cover transition-transform duration-[700ms] ease-premium group-hover:scale-[1.04]"
        />
      </div>
      <div className={cn("flex flex-col gap-2", isFeature ? "p-6" : "pt-4")}>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-teal">
          <span>{guide.category}</span>
          <span className="text-ink-muted">·</span>
          <span className="text-ink-muted">{guide.readTime}</span>
        </div>
        <h3
          className={cn(
            "font-display leading-snug text-ink transition-colors group-hover:text-teal",
            isFeature ? "text-[24px]" : "text-[18px]",
          )}
        >
          {guide.title}
        </h3>
        <p className={cn("text-[13px] text-ink-secondary", isFeature ? "clamp-3" : "clamp-2")}>
          {guide.excerpt}
        </p>
        <p className="mt-1 text-[11px] text-ink-muted">
          {guide.author} ·{" "}
          {new Date(guide.publishedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </Link>
  );
}
