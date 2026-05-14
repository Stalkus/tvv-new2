/**
 * @deprecated — Import from `@/lib/models` instead. This file remains as a
 * compatibility shim while the codebase migrates off the legacy `TourPackage`
 * shape onto the unified `Package` model.
 *
 * Mapping:
 *   TourPackage      →  Package          (use the unified model)
 *   DestinationPill  →  models/common
 *   CardBadge        →  models/common
 *   Destination      →  models/destination
 *   Experience       →  models/experience
 *   Guide / Reel /
 *     AndamanTileItem →  models/guide
 *   Review / FAQ     →  models/review, models/faq
 */

export type {
  CardBadge,
  DestinationPill,
  Destination,
  Experience,
  Guide,
  Reel,
  AndamanTileItem,
  Review,
  FAQ,
  Package,
} from "./models";

import type { Package } from "./models";

/**
 * Legacy flat-shape alias. New code: import `Package` from `@/lib/models`.
 *
 * For backward compatibility we expose computed shorthand accessors via the
 * adapter (see `lib/data.ts`). Existing components that need the old field
 * names should be migrated to use `Package` directly.
 */
export type TourPackage = Package & {
  // Legacy fields mirrored onto the unified model so older imports keep typing.
  // The shim in lib/data.ts populates them at read time.
  priceCurrent: number;
  priceOriginal?: number;
  image: string;
  gallery?: string[];
};