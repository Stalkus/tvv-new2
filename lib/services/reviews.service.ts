import { apiClient, apiConfig, endpoints, ok, fail, type ServiceResult } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import type { Review } from "@/lib/models";
import { reviewsMock, trustStatsMock } from "@/lib/mock";

export const reviewsService = {
  async list(limit?: number): Promise<ServiceResult<Review[]>> {
    if (apiConfig.useMock) return ok(limit ? reviewsMock.slice(0, limit) : reviewsMock, "mock");
    try {
      const data = await apiClient.get<Review[]>(endpoints.reviews.list);
      return ok((data ?? []).slice(0, limit), "live");
    } catch (err) {
      return fail<Review[]>(ApiError.fromUnknown(err), "live");
    }
  },

  async forTour(tourSlug: string, limit = 3): Promise<ServiceResult<Review[]>> {
    if (apiConfig.useMock) {
      // Mock: just return general reviews; in live mode the backend filters by tour.
      return ok(reviewsMock.slice(0, limit), "mock");
    }
    try {
      const data = await apiClient.get<Review[]>(endpoints.reviews.forTour(tourSlug));
      return ok((data ?? []).slice(0, limit), "live");
    } catch (err) {
      return fail<Review[]>(ApiError.fromUnknown(err), "live");
    }
  },

  async trustStats() {
    return ok(trustStatsMock, apiConfig.useMock ? "mock" : "live");
  },
};

export type ReviewsService = typeof reviewsService;
