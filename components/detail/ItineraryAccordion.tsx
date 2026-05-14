import { MapPin, Sunrise, Moon } from "lucide-react";
import type { ItineraryDay } from "@/lib/models";

interface Props {
  days: ItineraryDay[];
}

export function ItineraryAccordion({ days }: Props) {
  return (
    <ol className="space-y-3">
      {days.map((d, i) => (
        <li
          key={d.day}
          className="overflow-hidden rounded-lg border border-line bg-white"
        >
          <details open={i === 0} className="group">
            <summary className="flex cursor-pointer items-center gap-5 px-6 py-5 [&::-webkit-details-marker]:hidden">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-light font-mono text-[13px] font-bold text-teal">
                {String(d.day).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-label uppercase text-ink-muted">Day {d.day}</p>
                <p className="mt-1 font-display text-[17px] text-ink">{d.title}</p>
              </div>
              <span className="hidden items-center gap-1.5 text-[12px] text-ink-muted sm:inline-flex">
                <MapPin className="h-3 w-3" aria-hidden /> {d.city}
              </span>
              <span
                aria-hidden
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-ink-muted transition-transform duration-base group-open:rotate-45"
              >+</span>
            </summary>
            <div className="space-y-3 px-6 pb-6 pl-[5.25rem]">
              <p className="text-[14px] leading-relaxed text-ink-secondary">{d.description}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-ink-secondary">
                {d.stay && (
                  <span className="inline-flex items-center gap-1.5">
                    <Moon className="h-3.5 w-3.5 text-teal" aria-hidden /> Stay: {d.stay}
                  </span>
                )}
                {d.meals && (
                  <span className="inline-flex items-center gap-1.5">
                    <Sunrise className="h-3.5 w-3.5 text-teal" aria-hidden /> {d.meals}
                  </span>
                )}
              </div>
            </div>
          </details>
        </li>
      ))}
    </ol>
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
