import { Star } from "lucide-react";

interface TrustStat {
  value: string;
  label: string;
}

interface TrustBarProps {
  stats: TrustStat[];
}

/**
 * Props-driven trust strip. Render-only — host pages supply data via the
 * reviews service (`reviewsService.trustStats()`).
 */
export function TrustBar({ stats }: TrustBarProps) {
  if (!stats || stats.length === 0) return null;
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 divide-line lg:grid-cols-4 lg:divide-x">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-start gap-1 px-1 py-7 sm:px-6 ${i < 2 ? "border-b border-line lg:border-b-0" : ""}`}
            >
              <span className="inline-flex items-center gap-1.5 font-display text-[28px] font-bold leading-none text-ink">
                {s.value.includes("★") ? (
                  <>
                    {s.value.replace("★", "")}
                    <Star className="h-5 w-5 fill-gold text-gold" strokeWidth={0} aria-hidden />
                  </>
                ) : (
                  s.value
                )}
              </span>
              <p className="text-[12px] text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
