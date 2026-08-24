import { API_BASE_URL, DEFAULT_RETRIES, DEFAULT_TIMEOUT_MS } from "./config";

/**
 * Thin fetch wrapper used by every API service module.
 *
 * Security notes for whoever wires this up to the production VPS backend:
 * - Session state is expected to live in an httpOnly, Secure cookie set by
 *   the backend on login. This client never reads or writes an auth token
 *   to localStorage/sessionStorage — `credentials: "include"` is used so
 *   the browser attaches that cookie automatically over HTTPS.
 * - No API secret, wallet private key, or VPS credential should ever be
 *   passed into this client or embedded in frontend code. Anything of
 *   that nature belongs exclusively on the backend.
 * - Every response is treated as untrusted until validated — callers
 *   should not assume a 200 response body matches the expected shape
 *   without basic checks (see the individual service modules).
 */

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export class ApiTimeoutError extends ApiError {
  constructor() {
    super("The request timed out. Please try again.", 0, "TIMEOUT");
    this.name = "ApiTimeoutError";
  }
}

export class ApiNetworkError extends ApiError {
  constructor() {
    super("Unable to reach the server. Check your connection and try again.", 0, "NETWORK_ERROR");
    this.name = "ApiNetworkError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
  retries?: number;
  signal?: AbortSignal;
};

/** Dispatched in the browser whenever the backend reports an expired/invalid session. */
export const SESSION_EXPIRED_EVENT = "genesis:session-expired";

function notifySessionExpired() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
  }
}

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const base = API_BASE_URL || "";
  const url = new URL(path.replace(/^\//, ""), base || "http://placeholder.local/");
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }
  // When no real API_BASE_URL is configured we never actually fetch (demo
  // mode short-circuits in the service layer), so the placeholder origin
  // above is only ever used to satisfy the URL constructor.
  return base ? url.toString() : url.pathname + url.search;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calls the backend API at API_BASE_URL. Throws ApiError (or a subclass)
 * on any failure. Retries idempotent GET requests once on network failure
 * by default.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = "GET",
    body,
    query,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = method === "GET" ? DEFAULT_RETRIES : 0,
    signal,
  } = options;

  const url = buildUrl(path, query);
  let attempt = 0;

  for (;;) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const combinedSignal = signal
      ? mergeSignals(signal, controller.signal)
      : controller.signal;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: combinedSignal,
      });

      clearTimeout(timeout);

      if (res.status === 401) {
        notifySessionExpired();
        throw new ApiError("Your session has expired. Please log in again.", 401, "SESSION_EXPIRED");
      }

      if (!res.ok) {
        const message = await safeErrorMessage(res);
        throw new ApiError(message, res.status);
      }

      if (res.status === 204) return undefined as T;

      const data = await res.json().catch(() => {
        throw new ApiError("The server returned an invalid response.", res.status, "INVALID_JSON");
      });
      return data as T;
    } catch (err) {
      clearTimeout(timeout);

      if (err instanceof ApiError) throw err;

      const isAbort = err instanceof DOMException && err.name === "AbortError";
      const shouldRetry = attempt < retries;

      if (isAbort) {
        if (shouldRetry) {
          attempt += 1;
          await sleep(300 * attempt);
          continue;
        }
        throw new ApiTimeoutError();
      }

      if (shouldRetry) {
        attempt += 1;
        await sleep(300 * attempt);
        continue;
      }
      throw new ApiNetworkError();
    }
  }
}

/**
 * Multipart upload variant of apiFetch (for document/file uploads where a
 * JSON body isn't appropriate). Shares the same session/error handling.
 */
export async function apiFetchForm<T>(path: string, formData: FormData, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  const url = buildUrl(path);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.status === 401) {
      notifySessionExpired();
      throw new ApiError("Your session has expired. Please log in again.", 401, "SESSION_EXPIRED");
    }
    if (!res.ok) {
      const message = await safeErrorMessage(res);
      throw new ApiError(message, res.status);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof ApiError) throw err;
    const isAbort = err instanceof DOMException && err.name === "AbortError";
    throw isAbort ? new ApiTimeoutError() : new ApiNetworkError();
  }
}

async function safeErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (data && typeof data.message === "string") return data.message;
  } catch {
    // fall through
  }
  return `Request failed with status ${res.status}.`;
}

function mergeSignals(a: AbortSignal, b: AbortSignal): AbortSignal {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  if (a.aborted || b.aborted) controller.abort();
  a.addEventListener("abort", onAbort);
  b.addEventListener("abort", onAbort);
  return controller.signal;
}
