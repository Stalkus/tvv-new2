import { apiClient, apiConfig, endpoints, ok, fail, type ServiceResult } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import type { Destination, Region } from "@/lib/models";
import { destinationsMock } from "@/lib/mock";

interface DestinationQuery {
  region?: Region;
  continent?: string;
  authorityOnly?: boolean;
  limit?: number;
}

function applyQuery(list: Destination[], q: DestinationQuery): Destination[] {
  let out = list;
  if (q.region) out = out.filter((d) => d.region === q.region);
  if (q.continent) out = out.filter((d) => d.continent === q.continent);
  if (q.authorityOnly) out = out.filter((d) => d.isAuthorityHub);
  return q.limit ? out.slice(0, q.limit) : out;
}

export const destinationsService = {
  async list(q: DestinationQuery = {}): Promise<ServiceResult<Destination[]>> {
    if (apiConfig.useMock) return ok(applyQuery(destinationsMock, q), "mock");
    try {
      const data = await apiClient.get<Destination[]>(endpoints.destinations.list);
      return ok(applyQuery(data ?? [], q), "live");
    } catch (err) {
      return fail<Destination[]>(ApiError.fromUnknown(err), "live");
    }
  },

  async getBySlug(slug: string): Promise<ServiceResult<Destination | null>> {
    if (apiConfig.useMock) {
      const lower = slug.toLowerCase();
      const found = destinationsMock.find(
        (d) => d.slug === lower || d.aliases?.includes(lower),
      ) ?? null;
      return ok(found, "mock");
    }
    try {
      const data = await apiClient.get<Destination | null>(endpoints.destinations.detail(slug), { treat404AsNull: true });
      return ok(data, "live");
    } catch (err) {
      return fail<Destination | null>(ApiError.fromUnknown(err), "live");
    }
  },

  /** Frequently used: render-ordered destinations for the homepage tabs. */
  homepageShelf() {
    return this.list({ limit: 8 });
  },
};

export type DestinationsService = typeof destinationsService;
