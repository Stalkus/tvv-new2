import { apiClient, apiConfig, endpoints, ok, fail, type ServiceResult } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import type { Airport, FlightItinerary, FlightSearchInput, FlightSearchResponse } from "@/lib/models";
import { airportsMock, flightItinerariesMock } from "@/lib/mock";

export const flightsService = {
  async airports(query?: string): Promise<ServiceResult<Airport[]>> {
    if (apiConfig.useMock) {
      const q = query?.toLowerCase().trim();
      const filtered = q
        ? airportsMock.filter((a) => `${a.code} ${a.city} ${a.name}`.toLowerCase().includes(q))
        : airportsMock;
      return ok(filtered, "mock");
    }
    try {
      const url = query ? `${endpoints.flights.airports}?q=${encodeURIComponent(query)}` : endpoints.flights.airports;
      const data = await apiClient.get<Airport[]>(url);
      return ok(data ?? [], "live");
    } catch (err) {
      return fail<Airport[]>(ApiError.fromUnknown(err), "live");
    }
  },

  async search(input: FlightSearchInput): Promise<ServiceResult<FlightSearchResponse>> {
    if (apiConfig.useMock) {
      const matched = flightItinerariesMock.filter((it) => {
        const seg = it.legs[0].segments[0];
        const last = it.legs[0].segments[it.legs[0].segments.length - 1];
        return seg.from.code === input.from && last.to.code === input.to;
      });
      const results: FlightItinerary[] = matched.length > 0 ? matched : flightItinerariesMock.slice(0, 3);
      return ok({
        query: input,
        results,
        meta: {
          total: results.length,
          fetchedAt: new Date().toISOString(),
          vendors: ["mock"],
        },
      }, "mock");
    }
    try {
      const data = await apiClient.post<FlightSearchResponse>(endpoints.flights.search, input);
      if (!data) throw new ApiError("server", "Empty response from flights search");
      return ok(data, "live");
    } catch (err) {
      return fail<FlightSearchResponse>(ApiError.fromUnknown(err), "live");
    }
  },
};

export type FlightsService = typeof flightsService;
