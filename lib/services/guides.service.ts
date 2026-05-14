import { apiClient, apiConfig, endpoints, ok, fail, type ServiceResult } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import type { AndamanTileItem, Guide, Reel } from "@/lib/models";
import { andamanSpotlightMock, guidesMock, reelsMock } from "@/lib/mock";

interface GuideQuery {
  category?: string;
  tag?: string;
  limit?: number;
}

function apply(list: Guide[], q: GuideQuery): Guide[] {
  let out = list;
  if (q.category) out = out.filter((g) => g.category.toLowerCase() === q.category!.toLowerCase());
  if (q.tag) out = out.filter((g) => g.tags?.includes(q.tag!.toLowerCase()));
  return q.limit ? out.slice(0, q.limit) : out;
}

export const guidesService = {
  async list(q: GuideQuery = {}): Promise<ServiceResult<Guide[]>> {
    if (apiConfig.useMock) return ok(apply(guidesMock, q), "mock");
    try {
      const data = await apiClient.get<Guide[]>(endpoints.guides.list);
      return ok(apply(data ?? [], q), "live");
    } catch (err) {
      return fail<Guide[]>(ApiError.fromUnknown(err), "live");
    }
  },

  async getBySlug(slug: string): Promise<ServiceResult<Guide | null>> {
    if (apiConfig.useMock) return ok(guidesMock.find((g) => g.slug === slug) ?? null, "mock");
    try {
      const data = await apiClient.get<Guide | null>(endpoints.guides.detail(slug), { treat404AsNull: true });
      return ok(data, "live");
    } catch (err) {
      return fail<Guide | null>(ApiError.fromUnknown(err), "live");
    }
  },

  async reels(limit?: number): Promise<ServiceResult<Reel[]>> {
    const list = limit ? reelsMock.slice(0, limit) : reelsMock;
    return ok(list, apiConfig.useMock ? "mock" : "live");
  },

  async andamanSpotlight(): Promise<ServiceResult<AndamanTileItem[]>> {
    return ok(andamanSpotlightMock, apiConfig.useMock ? "mock" : "live");
  },
};

export type GuidesService = typeof guidesService;
