/**
 * General deposits entry point. Bitcoin and USDT are the currently
 * supported deposit methods; this module re-exports both services under
 * one namespace so additional deposit rails (e.g. bank transfer) can be
 * added here later without changing call sites.
 *
 * Backend contract: see lib/api/services/bitcoin.ts and
 * lib/api/services/usdt.ts
 */

export * as bitcoin from "./bitcoin";
export * as usdt from "./usdt";
