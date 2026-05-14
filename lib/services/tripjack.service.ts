/**
 * TripJack-specific service.
 *
 * Most consumers should use `packagesService` (which merges manual + vendor).
 * This service exposes raw vendor access for:
 *   • admin tooling
 *   • sync jobs
 *   • debugging price drift between vendor and our catalog
 */

import { apiClient, apiConfig, endpoints, ok, fail, type ServiceResult } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import type { Package, VendorPackage } from "@/lib/models";
import { tripjackPackages } from "@/lib/mock";
import { fromTripJack, fromTripJackList } from "@/lib/adapters";

export const tripjackService = {
  /** Raw vendor packages (pre-adapter). */
  async listRaw(): Promise<ServiceResult<VendorPackage[]>> {
    if (apiConfig.useMock) return ok(tripjackPackages, "mock", "tripjack");
    try {
      const data = await apiClient.get<VendorPackage[]>(endpoints.tripjack.listPackages);
      return ok(data ?? [], "live", "tripjack");
    } catch (err) {
      return fail<VendorPackage[]>(ApiError.fromUnknown(err), "live");
    }
  },

  /** Adapted vendor packages — same shape as manual packages. */
  async listUnified(): Promise<ServiceResult<Package[]>> {
    const raw = await this.listRaw();
    if (!raw.ok) return raw as ServiceResult<Package[]>;
    return ok(fromTripJackList(raw.data), raw.meta.source, "tripjack");
  },

  /** Single vendor package by vendor packageId, returned in unified shape. */
  async getById(packageId: string): Promise<ServiceResult<Package | null>> {
    if (apiConfig.useMock) {
      const raw = tripjackPackages.find((p) => p.packageId === packageId);
      return ok(raw ? fromTripJack(raw) : null, "mock", "tripjack");
    }
    try {
      const data = await apiClient.get<VendorPackage | null>(endpoints.tripjack.packageDetail(packageId), { treat404AsNull: true });
      return ok(data ? fromTripJack(data) : null, "live", "tripjack");
    } catch (err) {
      return fail<Package | null>(ApiError.fromUnknown(err), "live");
    }
  },
};
