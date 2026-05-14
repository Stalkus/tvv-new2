import { apiClient, apiConfig, endpoints, ok, fail, type ServiceResult } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import type { Experience } from "@/lib/models";
import { experiencesMock } from "@/lib/mock";

interface ExperienceQuery {
  scope?: Experience["scope"];
  limit?: number;
}

export const experiencesService = {
  async list(q: ExperienceQuery = {}): Promise<ServiceResult<Experience[]>> {
    if (apiConfig.useMock) {
      let out = experiencesMock;
      if (q.scope) out = out.filter((e) => !e.scope || e.scope === "global" || e.scope === q.scope);
      return ok(q.limit ? out.slice(0, q.limit) : out, "mock");
    }
    try {
      const data = await apiClient.get<Experience[]>(endpoints.experiences.list);
      return ok(data ?? [], "live");
    } catch (err) {
      return fail<Experience[]>(ApiError.fromUnknown(err), "live");
    }
  },

  async getBySlug(slug: string): Promise<ServiceResult<Experience | null>> {
    if (apiConfig.useMock) return ok(experiencesMock.find((e) => e.slug === slug) ?? null, "mock");
    try {
      const data = await apiClient.get<Experience | null>(endpoints.experiences.detail(slug), { treat404AsNull: true });
      return ok(data, "live");
    } catch (err) {
      return fail<Experience | null>(ApiError.fromUnknown(err), "live");
    }
  },
};

export type ExperiencesService = typeof experiencesService;
