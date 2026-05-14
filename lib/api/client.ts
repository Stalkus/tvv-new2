/**
 * Thin HTTP client over `fetch` with timeout + retry + typed errors.
 *
 * Services consume this — components never do. Mock-mode short-circuiting
 * happens inside individual services (so each service can switch independently),
 * not here.
 */

import { apiConfig } from "./config";
import { ApiError, fromStatus } from "./errors";

interface RequestOptions extends Omit<RequestInit, "signal"> {
  /** Override the default timeout (ms). */
  timeoutMs?: number;
  /** Override the default retry count. */
  retries?: number;
  /** Treat 404 as data:null rather than throwing. */
  treat404AsNull?: boolean;
  /** Use a custom base URL (e.g. for direct TripJack hits). */
  baseUrl?: string;
}

async function doFetch(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export const apiClient = {
  async request<T>(path: string, options: RequestOptions = {}): Promise<T | null> {
    const {
      timeoutMs = apiConfig.timeoutMs,
      retries = apiConfig.retries,
      treat404AsNull,
      baseUrl = apiConfig.baseUrl,
      headers,
      ...init
    } = options;

    const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

    let attempt = 0;
    let lastError: ApiError | undefined;
    while (attempt <= retries) {
      try {
        const res = await doFetch(
          url,
          {
            ...init,
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              ...headers,
            },
            // Next.js fetch cache controls — services pass `next: { revalidate }` via init.
          },
          timeoutMs,
        );

        if (res.status === 404 && treat404AsNull) return null;
        if (!res.ok) {
          const body = await safeJson(res);
          throw fromStatus(res.status, body);
        }
        // Empty response (204) → null
        if (res.status === 204) return null;
        return (await res.json()) as T;
      } catch (err) {
        lastError = ApiError.fromUnknown(err);
        if (!lastError.retryable || attempt === retries) throw lastError;
        // Exponential-ish backoff: 200ms, 500ms, 1.2s
        await delay(200 * Math.pow(2.2, attempt));
        attempt++;
      }
    }
    throw lastError ?? new ApiError("unknown", "Request failed");
  },

  get<T>(path: string, options?: RequestOptions) {
    return this.request<T>(path, { ...options, method: "GET" });
  },

  post<T, B = unknown>(path: string, body: B, options?: RequestOptions) {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },
};

async function safeJson(res: Response) {
  try { return await res.json(); } catch { return undefined; }
}
