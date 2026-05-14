import { MapPin, Sunrise, Moon } from "lucide-react";
import type { ItineraryDay } from "@/lib/models";

interface Props {
  days: ItineraryDay[];
}

export function ItineraryAccordion({ days }: Props) {
  return (
    <div className="border-t border-line/40">
      {days.map((d, i) => (
        <details
          key={d.day}
          open={i === 0}
          className="group border-b border-line/40 bg-white transition-colors hover:bg-cream/20"
        >
          <summary className="flex cursor-pointer items-start lg:items-center gap-6 py-6 px-2 lg:px-6 [&::-webkit-details-marker]:hidden">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal/5 font-display text-[18px] text-teal">
              {String(d.day).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-muted">Day {d.day}</p>
              <p className="mt-1 font-display text-[22px] leading-snug text-ink">{d.title}</p>
            </div>
            <span className="hidden items-center gap-2 text-[13px] font-medium tracking-wide text-ink-secondary sm:inline-flex">
              <MapPin className="h-3.5 w-3.5 text-teal" aria-hidden /> {d.city}
            </span>
            <span
              aria-hidden
              className="ml-auto inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line/60 text-ink-muted transition-transform duration-300 group-open:rotate-45"
            >+</span>
          </summary>
          <div className="space-y-4 px-2 pb-8 pl-[5rem] lg:px-6 lg:pl-[6.5rem]">
            <p className="max-w-3xl text-[16px] leading-[1.8] text-ink-secondary text-pretty">{d.description}</p>
            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2 text-[13px] font-medium text-ink-secondary">
              {d.stay && (
                <span className="inline-flex items-center gap-2">
                  <Moon className="h-4 w-4 text-teal" aria-hidden /> Stay: {d.stay}
                </span>
              )}
              {d.meals && (
                <span className="inline-flex items-center gap-2">
                  <Sunrise className="h-4 w-4 text-teal" aria-hidden /> {d.meals}
                </span>
              )}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}

// Helper to generate plausible itinerary days from destination pills
export function generateItinerary(
  destinations: { days: number; city: string }[],
  highlights: string[] = [],
): ItineraryDay[] {
  const days: ItineraryDay[] = [];
  let dayNum = 1;
  for (const seg of destinations) {
    for (let i = 0; i < seg.days; i++) {
      const isArrival = i === 0;
      const isDeparture = i === seg.days - 1 && seg === destinations[destinations.length - 1];
      const highlight = highlights[(dayNum - 1) % Math.max(highlights.length, 1)] ?? "";
      days.push({
        day: dayNum,
        title: isArrival
          ? `Arrival in ${seg.city}`
          : isDeparture
            ? `Departure from ${seg.city}`
            : highlight || `${seg.city} — a slow morning, a curated afternoon`,
        city: seg.city,
        description: isArrival
          ? `Your specialist meets you at the airport and transfers you privately to your stay in ${seg.city}. The afternoon is yours — your concierge is on call, and the team has briefed your evening's reservation.`
          : isDeparture
            ? `A leisurely morning before your private transfer to the airport. Your specialist is reachable on the road.`
            : `A handpicked day in ${seg.city} — ${highlight ? highlight.toLowerCase() : "a private experience your specialist has woven into your route"}.`,
        stay: `Handpicked boutique stay, ${seg.city}`,
        meals: isArrival ? "Welcome dinner" : "Breakfast included",
      });
      dayNum++;
    }
  }
  return days;
}
