import { apiClient, apiConfig, endpoints, ok, fail, type ServiceResult } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import type {
  FerryAvailability,
  FerryOperator,
  FerryRoute,
  FerrySchedule,
  FerrySearchInput,
  FerrySearchResult,
} from "@/lib/models";
import { ferryRoutesMock, ferrySchedulesMock } from "@/lib/mock";

function deterministicSeats(scheduleId: string, date: string): number {
  // Cheap deterministic pseudo-random so the mock UI is stable.
  let h = 0;
  for (const ch of scheduleId + date) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return 12 + (h % 60);
}

export const ferryService = {
  async listRoutes(): Promise<ServiceResult<FerryRoute[]>> {
    if (apiConfig.useMock) return ok(ferryRoutesMock, "mock");
    try {
      const data = await apiClient.get<FerryRoute[]>(endpoints.ferry.routes);
      return ok(data ?? [], "live");
    } catch (err) {
      return fail<FerryRoute[]>(ApiError.fromUnknown(err), "live");
    }
  },

  async getRoute(slug: string): Promise<ServiceResult<FerryRoute | null>> {
    if (apiConfig.useMock) {
      const found = ferryRoutesMock.find((r) => r.slug === slug) ?? null;
      return ok(found, "mock");
    }
    try {
      const data = await apiClient.get<FerryRoute | null>(endpoints.ferry.routeDetail(slug), { treat404AsNull: true });
      return ok(data, "live");
    } catch (err) {
      return fail<FerryRoute | null>(ApiError.fromUnknown(err), "live");
    }
  },

  async schedulesFor(fromCode: string, toCode: string): Promise<ServiceResult<FerrySchedule[]>> {
    if (apiConfig.useMock) {
      const result = ferrySchedulesMock.filter(
        (s) => s.from.code === fromCode && s.to.code === toCode,
      );
      return ok(result, "mock");
    }
    try {
      const data = await apiClient.get<FerrySchedule[]>(
        `${endpoints.ferry.schedules}?from=${encodeURIComponent(fromCode)}&to=${encodeURIComponent(toCode)}`,
      );
      return ok(data ?? [], "live");
    } catch (err) {
      return fail<FerrySchedule[]>(ApiError.fromUnknown(err), "live");
    }
  },

  /** Mock-aware search. In production this hits the existing backend ferry API. */
  async search(input: FerrySearchInput): Promise<ServiceResult<FerrySearchResult[]>> {
    if (apiConfig.useMock) {
      const matches = ferrySchedulesMock.filter(
        (s) => s.from.code === input.from && s.to.code === input.to,
      );
      const result: FerrySearchResult[] = matches.map((schedule) => {
        const seatsAvailable = deterministicSeats(schedule.scheduleId, input.date);
        const availability: FerryAvailability = {
          scheduleId: schedule.scheduleId,
          date: input.date,
          seatsAvailable,
          classes: schedule.classes.map((c, i) => ({
            class: c,
            seatsAvailable: Math.max(2, Math.floor(seatsAvailable / (schedule.classes.length || 1)) - i),
            price: schedule.startingPrice + i * 350,
          })),
        };
        return { schedule, availability };
      });
      return ok(result, "mock");
    }
    try {
      const data = await apiClient.post<FerrySearchResult[]>(endpoints.ferry.search, input);
      return ok(data ?? [], "live");
    } catch (err) {
      return fail<FerrySearchResult[]>(ApiError.fromUnknown(err), "live");
    }
  },

  /** Static reference data — operators TVV has direct integrations with. */
  knownOperators(): FerryOperator[] {
    return ["makruzz", "green-ocean", "itt", "nautika"];
  },
};

export type FerryService = typeof ferryService;
