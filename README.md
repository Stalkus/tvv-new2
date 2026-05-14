# The Vacation Voice (TVV)

A premium travel platform built on Next.js 15 — curated global journeys, anchored in Andaman expertise — with a backend-ready architecture that supports manual editorial packages, the existing ferry booking APIs, future flight integrations, and TripJack vendor packages, behind a single unified UI.

## Stack
- **Next.js 15** (App Router, React Server Components, TypeScript strict)
- **TailwindCSS** — design tokens mirrored in `tailwind.config.ts` and `app/globals.css`
- **Framer Motion** — restrained, premium motion
- **lucide-react** — icons
- **shadcn-style primitives** — hand-rolled to the TVV design system

## Getting started
```bash
npm install
npm run dev
```
Open http://localhost:3000. The site runs entirely off mock data by default (see env section below).

---

## Architecture (added in the backend-ready refactor)

```
                       ┌─────────────────────────────────────────────────┐
                       │                  UI / Pages                     │
                       │  app/**, components/sections/**, cards/**       │
                       │            (consume props only)                 │
                       └────────────────────┬────────────────────────────┘
                                            │
                                            ▼
                       ┌─────────────────────────────────────────────────┐
                       │                Services (lib/services)          │
                       │  packages · ferry · flights · destinations ·   │
                       │  tripjack · calculator · search · guides ·     │
                       │  experiences · reviews · faqs                  │
                       └──────────────┬─────────────────┬────────────────┘
                                      │                 │
                                      ▼                 ▼
                ┌──────────────────────────┐  ┌────────────────────────┐
                │   lib/api (HTTP client)  │  │   lib/mock (dev data)  │
                │   client, errors, types  │  │   packages, destinations,│
                │   config, endpoints      │  │   ferry, flights,      │
                └──────────────────────────┘  │   tripjack, guides…    │
                                              └────────────────────────┘
                                                       │
                                                       ▼
                                    ┌─────────────────────────────────┐
                                    │   lib/adapters                  │
                                    │   manual.adapter  ┐             │
                                    │                   ├──► Package  │
                                    │   tripjack.adapter┘             │
                                    └─────────────────────────────────┘
                                                       │
                                                       ▼
                                    ┌─────────────────────────────────┐
                                    │   lib/models  (typed domain)    │
                                    │   Package · Destination · Ferry │
                                    │   Flight · Experience · Review  │
                                    │   FAQ · Guide · Calculator      │
                                    └─────────────────────────────────┘
```

### Hard rules
1. **Components NEVER fetch backend data directly.** They take props or call services. They never reach into `lib/mock` or `lib/adapters`.
2. **Services are the only abstraction over data sources.** They return a uniform `ServiceResult<T>` envelope — `{ ok: true, data, meta }` or `{ ok: false, error, meta }`. Pages branch on `ok`.
3. **Vendor responses never leak past the adapter boundary.** TripJack camelCase + nested `priceInfo` is translated to the unified `Package` shape in `lib/adapters/tripjack.adapter.ts`. The same is true for manual packages (CMS-shaped) — both end up as `Package`.
4. **One card, two sources.** `PackageCard` consumes `Package` and renders identically whether the underlying source is manual or TripJack. A `data-vendor` attribute is set for debugging; an optional `showVendorChip` prop reveals provenance on internal surfaces.

### Service envelope
```ts
type ServiceResult<T> =
  | { ok: true;  data: T; meta: { source: "live"|"mock"|"cache"; fetchedAt: string; vendor?: string } }
  | { ok: false; error: ApiError; meta: ... };
```
This is uniform across every service — packages, ferry, flights, etc.

### Mock vs live switching
The env var `NEXT_PUBLIC_USE_MOCK` (default `"true"`) controls whether services read from `lib/mock` or call HTTP endpoints. Set to `"false"` in production to hit `NEXT_PUBLIC_API_BASE_URL`. Endpoints are defined once, in `lib/api/config.ts`:

```ts
endpoints.packages.list           // GET /v1/packages
endpoints.packages.detail(slug)   // GET /v1/packages/:slug
endpoints.ferry.routes            // GET /v1/ferry/routes
endpoints.ferry.search            // POST /v1/ferry/search
endpoints.flights.search          // POST /v1/flights/search
endpoints.tripjack.listPackages   // GET /v1/tripjack/packages
endpoints.calculator.estimate     // POST /v1/calculator/estimate
// …
```

When the backend is ready, no component changes are needed.

---

## Project layout

```
app/                       # Next.js 15 App Router
├── layout.tsx, page.tsx, globals.css
├── andaman/               # Andaman signature hub
├── packages/
│   ├── domestic/{,[region]}
│   └── international/
├── tours/[slug]/          # Tour detail (handles manual + TripJack uniformly)
├── destinations/[slug]/
├── experiences/{,[slug]}
├── honeymoon/, luxury/, ferry/, flights/, calculator/
├── ferry/[route]/         # Per-route schedules page (new)
├── guides/{,[slug]}
├── corporate/, about/, contact/, faq/, privacy/, terms/, search/
├── error.tsx              # Global error boundary
├── loading.tsx            # Global loading skeleton
├── packages/error.tsx     # Segment-level error
├── tours/[slug]/loading.tsx
├── sitemap.ts             # Driven by mock + adapters (swap to services for live)
├── robots.ts
└── not-found.tsx

components/
├── layout/                # Navbar, MegaMenu, MobileNav, Footer, ConciergeWidget, Logo
├── ui/                    # Container, Section, Button, Badge, SearchBar, FilterChips, Stars, Breadcrumb, JsonLd
├── cards/                 # PackageCard (NEW unified), TourPackageCard (shim), DestinationCard, ExperienceCard, GuideCard, AndamanTile, ReelCard
├── sections/              # All sections are now props-driven (Hero, TrustBar, AndamanSpotlight, DestinationTabs, TravelByExperience,
│                          # FeaturedJourneys, EditorialGuides, ReelStorytelling, ConciergeCTA, TestimonialStrip, PackageListing, CardRail, EnquiryForm)
├── detail/                # TourGallery, StickyPriceCard, ItineraryAccordion
└── skeletons/             # PackageCardSkeleton, DestinationCardSkeleton, SectionSkeleton

lib/
├── models/                # Typed domain models — single source of truth
│   ├── common.ts          # Region, Pricing, CardBadge, DestinationPill, Hero, SeoMeta, …
│   ├── package.ts         # Package (unified) + ManualPackage + VendorPackage + ItineraryDay + Policy
│   ├── destination.ts
│   ├── ferry.ts           # FerryPort, FerrySchedule, FerryRoute, FerryAvailability, FerrySearchInput
│   ├── flight.ts          # Airport, Airline, FlightSegment, FlightLeg, FlightFare, FlightItinerary, FlightSearchInput
│   ├── experience.ts, faq.ts, review.ts, guide.ts (Reel, AndamanTileItem)
│   ├── calculator.ts
│   └── index.ts           # Barrel — import from "@/lib/models"
├── api/                   # HTTP client + error model + result envelope
│   ├── client.ts          # fetch wrapper, timeout, retry, typed errors
│   ├── config.ts          # endpoints + apiConfig (env-driven mock switch)
│   ├── errors.ts          # ApiError, ApiErrorCode, fromStatus()
│   ├── types.ts           # ServiceResult<T>, Page<T>, ok()/fail() helpers
│   └── index.ts
├── adapters/              # Boundary translators (raw → unified)
│   ├── manual.adapter.ts
│   ├── tripjack.adapter.ts
│   ├── utils.ts           # vendorSlug, regionFor, unifyThemes
│   └── index.ts
├── services/              # Components talk to these — never to mock/adapters/api directly
│   ├── packages.service.ts          (.list, .getBySlug, .getRelated, .byRegion, .byTheme, .featured)
│   ├── destinations.service.ts      (.list, .getBySlug, .homepageShelf)
│   ├── ferry.service.ts             (.listRoutes, .getRoute, .schedulesFor, .search, .knownOperators)
│   ├── flights.service.ts           (.airports, .search)
│   ├── tripjack.service.ts          (.listRaw, .listUnified, .getById)
│   ├── calculator.service.ts        (.estimate)
│   ├── search.service.ts            (.query — unified across packages/destinations/guides)
│   ├── guides.service.ts            (.list, .getBySlug, .reels, .andamanSpotlight)
│   ├── experiences.service.ts       (.list, .getBySlug)
│   ├── reviews.service.ts           (.list, .forTour, .trustStats)
│   ├── faqs.service.ts              (.list)
│   └── index.ts
├── mock/                  # Dev-only fixtures (services source from here when useMock=true)
│   ├── packages.ts        # ManualPackage[] — internally authored shape
│   ├── tripjack.ts        # VendorPackage[] — raw TripJack-shaped responses
│   ├── destinations.ts, ferry.ts, flights.ts, experiences.ts, guides.ts, reviews.ts, faqs.ts
│   ├── _image.ts          # Unsplash URL builder
│   └── index.ts
├── seo.ts                 # buildMetadata(), org/breadcrumb/faq/tour JSON-LD helpers
├── utils.ts               # cn(), formatINR, formatPriceShort, slugify
├── data.ts                # @deprecated — compatibility shim, re-exports unified data
└── types.ts               # @deprecated — compatibility shim, re-exports from lib/models
```

---

## The unified `Package` model

`Package` is the shape consumed by `PackageCard`, the tour detail page, every listing, related-rails, and search. It is built from one of:

- `ManualPackage` — what we author internally (CMS / admin). Adapter: [`fromManual`](lib/adapters/manual.adapter.ts).
- `VendorPackage` — TripJack's raw response (vendor camelCase, nested `priceInfo`). Adapter: [`fromTripJack`](lib/adapters/tripjack.adapter.ts).

```
ManualPackage   ─┐
                 ├──► adapter ──► Package (UnifiedPackage) ──► PackageCard / TourDetail
VendorPackage  ──┘
```

Key normalised fields:
```ts
{
  slug: string;
  vendor: { source: "manual" | "tripjack"; externalId?; vendorName?; vendorUrl? };
  title, subtitle, description, destination, region, countryCode,
  durationDays, durationNights, rating, ratingCount,
  pricing: { currency, perAdult, originalPerAdult?, pricingModel, dynamic?, breakdown? },
  hero: { image, gallery?: MediaAsset[] },
  destinations: DestinationPill[],
  badges?, themes?, highlights?, inclusions?, exclusions?, itinerary?: ItineraryDay[],
  policy?: { cancellation?, payment?, refund? },
  audit?: { createdAt?, updatedAt?, vendorSyncedAt? },
  flags?: { dynamicPricing?, aiCustomisable?, instantConfirm?, soldOut? },
}
```

The `flags` namespace exists for future features: AI itinerary customisation, dynamic pricing experiments, real-time inventory.

---

## Routes added

| Route | Purpose |
|---|---|
| `/flights` | Flight search landing + sample fares (uses `flightsService`) |
| `/calculator` | Travel-cost estimator (uses `calculatorService`, client component) |
| `/ferry/[route]` | Per-route ferry schedules — e.g. `/ferry/port-blair-to-havelock` |

All three are statically generated where possible and revalidated.

---

## Resilience — loading & error handling

- **Loading skeletons**: `app/loading.tsx` (global), `app/packages/loading.tsx`, `app/tours/[slug]/loading.tsx`, `app/ferry/loading.tsx`, `app/flights/loading.tsx`. Generic `SectionSkeleton` and `PackageCardSkeleton` are reusable.
- **Error boundaries**: `app/error.tsx` (global), `app/packages/error.tsx` (segment-level). Designed to be polite — every error fallback offers a path to the concierge.
- **Empty states**: every section renders gracefully on `[]` data (returns null or shows an editorial empty message).
- **Missing fields**: `PackageCard` handles missing rating, missing image (fallback gradient), missing destinations, and renders "Price on request" when pricing is unavailable.
- **Slow vendor APIs**: `apiClient` enforces a 12-second timeout (configurable), retries on `network`/`timeout`/`server`/`vendor_unavailable`, and surfaces typed `ApiError` instances so services can fail cleanly.

---

## Environment variables

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK=true                              # set "false" to hit real APIs
NEXT_PUBLIC_API_BASE_URL=https://api.thevacationvoice.com
NEXT_PUBLIC_TRIPJACK_BASE_URL=https://api.tripjack.com
NEXT_PUBLIC_API_TIMEOUT_MS=12000
NEXT_PUBLIC_API_RETRIES=1
```

You can mix-and-match per service in the future by overriding `apiConfig.useMock` checks inside individual services (e.g. ferry can be live while flights stays mocked).

---

## Migrating to a live backend

When the backend is ready:

1. Set `NEXT_PUBLIC_USE_MOCK=false`.
2. Implement the endpoints listed in `lib/api/config.ts`.
3. Have each endpoint return data already in the shape declared in `lib/models` (or extend the relevant service to normalise — services are the boundary).
4. For TripJack: the backend should proxy `endpoints.tripjack.*` and the service will run the existing `fromTripJack` adapter on the response. The adapter is the only file that needs to change if TripJack alters its schema.
5. Optionally swap `lib/mock` for live data fetches inside `sitemap.ts` (it's already structured around the same imports).

No component file should need to change. That's the point.

---

## Future-readiness hooks

The architecture explicitly anticipates:

- **Dynamic pricing**: `Package.pricing.dynamic` + `flags.dynamicPricing`. Wire a price-refresh tick on tour detail without touching `PackageCard`.
- **AI itinerary planner**: `flags.aiCustomisable` + the `itinerary: ItineraryDay[]` array on `Package`. The detail page already renders provided itineraries when present and falls back to a generated one.
- **CRM integrations**: `EnquiryForm` posts to a single endpoint — pipe to your CRM (HubSpot, Zoho, Salesforce) without touching the form UI.
- **Booking workflows**: `services/packages.service.ts` is the obvious extension point for `.book(slug, payload)`, `.holdInventory()`, etc.
- **User dashboards**: introduce `services/auth.service.ts` and `services/bookings.service.ts` — the same `ServiceResult<T>` envelope keeps consumers consistent.
- **Payments**: pricing already separates `perAdult`, `originalPerAdult`, `breakdown`, and `currency` — payment intent creation maps cleanly onto these.
- **Loyalty**: add `flags.loyaltyEligible` and a `services/loyalty.service.ts`. No UI change needed for the card itself.
- **Mobile app APIs**: the model + service contracts are platform-agnostic; the same shapes can be served to a React Native / Flutter client.

---

## What changed in this phase (vs the initial build)

- All hardcoded data was moved out of components into `lib/mock` and behind services.
- Sections (Hero, TrustBar, AndamanSpotlight, DestinationTabs, TravelByExperience, FeaturedJourneys, EditorialGuides, ReelStorytelling, TestimonialStrip, PackageListing) are now strict props-driven.
- `TourPackageCard` is now a thin wrapper around `PackageCard` (which consumes the unified `Package` model). Identical visuals, zero design changes.
- Every page is an async server component that fetches via services in parallel (`Promise.all`).
- Three new routes added: `/flights`, `/calculator`, `/ferry/[route]`.
- Loading skeletons and error boundaries added at root + segment level.
- Sitemap now sources from `lib/mock` + adapters (same pipeline services use), so live and mocked builds produce stable URLs.
- `lib/types.ts` and `lib/data.ts` are retained as deprecated shims for backward compatibility.

The visual design system, layout, typography, spacing, motion, and copy are **unchanged**.
