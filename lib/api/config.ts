/**
 * Centralized API configuration.
 *
 * The backend developer connects the real VPS-hosted API by setting
 * NEXT_PUBLIC_API_BASE_URL in the deployment environment (.env.production
 * or the hosting platform's environment variables). Nothing in this file
 * should ever hardcode a VPS IP address, hostname, or credential.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "";

/**
 * App data mode.
 *
 * "demo"       — no backend is connected yet. Service modules return
 *                clearly-labelled mock data so the UI can be built,
 *                reviewed, and demoed end to end.
 * "production" — service modules call the real backend at API_BASE_URL.
 *                No mock/fake financial data is ever returned in this mode.
 *
 * Controlled by NEXT_PUBLIC_APP_MODE. Defaults to "demo" whenever
 * API_BASE_URL has not been configured, so the site never silently
 * presents fabricated balances or transactions as if they were real.
 */
export type AppMode = "demo" | "production";

function resolveAppMode(): AppMode {
  const configured = process.env.NEXT_PUBLIC_APP_MODE;
  if (configured === "production" && API_BASE_URL) return "production";
  return "demo";
}

export const APP_MODE: AppMode = resolveAppMode();
export const IS_DEMO_MODE = APP_MODE === "demo";

export const DEFAULT_TIMEOUT_MS = 15_000;
export const DEFAULT_RETRIES = 1;

/** Simulated network latency for demo-mode mock responses. */
export const MOCK_LATENCY_MS = 450;
