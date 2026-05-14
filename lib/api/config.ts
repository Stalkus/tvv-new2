/**
 * API configuration — single source of truth for endpoints, timeouts, and
 * the mock-mode switch.
 *
 * In development we typically run with NEXT_PUBLIC_USE_MOCK=true so the
 * frontend works without a backend. Flip the env var (or set per-service)
 * to hit real APIs.
 */

const env = (key: string, fallback: string) =>
  (typeof process !== "undefined" && process.env?.[key]) || fallback;

export const apiConfig = {
  baseUrl: env("NEXT_PUBLIC_API_BASE_URL", "https://api.thevacationvoice.com"),
  tripjackBaseUrl: env("NEXT_PUBLIC_TRIPJACK_BASE_URL", "https://api.tripjack.com"),
  timeoutMs: Number(env("NEXT_PUBLIC_API_TIMEOUT_MS", "12000")),
  retries: Number(env("NEXT_PUBLIC_API_RETRIES", "1")),
  /** Global mock switch — when true, services read from lib/mock instead of HTTP. */
  useMock: env("NEXT_PUBLIC_USE_MOCK", "true") === "true",
} as const;

export const endpoints = {
  packages: {
    list: "/v1/packages",
    detail: (slug: string) => `/v1/packages/${encodeURIComponent(slug)}`,
    featured: "/v1/packages/featured",
    related: (slug: string) => `/v1/packages/${encodeURIComponent(slug)}/related`,
  },
  destinations: {
    list: "/v1/destinations",
    detail: (slug: string) => `/v1/destinations/${encodeURIComponent(slug)}`,
  },
  ferry: {
    routes: "/v1/ferry/routes",
    routeDetail: (slug: string) => `/v1/ferry/routes/${encodeURIComponent(slug)}`,
    search: "/v1/ferry/search",
    schedules: "/v1/ferry/schedules",
  },
  flights: {
    search: "/v1/flights/search",
    airports: "/v1/flights/airports",
  },
  tripjack: {
    listPackages: "/v1/tripjack/packages",
    packageDetail: (id: string) => `/v1/tripjack/packages/${encodeURIComponent(id)}`,
  },
  calculator: {
    estimate: "/v1/calculator/estimate",
  },
  guides: {
    list: "/v1/guides",
    detail: (slug: string) => `/v1/guides/${encodeURIComponent(slug)}`,
  },
  reviews: {
    list: "/v1/reviews",
    forTour: (slug: string) => `/v1/reviews?tour=${encodeURIComponent(slug)}`,
  },
  faqs: {
    list: "/v1/faqs",
  },
  search: {
    universal: "/v1/search",
  },
  experiences: {
    list: "/v1/experiences",
    detail: (slug: string) => `/v1/experiences/${encodeURIComponent(slug)}`,
  },
} as const;
