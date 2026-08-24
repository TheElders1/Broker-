/**
 * General withdrawals entry point. Bitcoin and USDT are the currently
 * supported withdrawal methods; this module re-exports both services
 * under one namespace so additional withdrawal rails can be added later
 * without changing call sites.
 *
 * Backend contract: see lib/api/services/bitcoin.ts and
 * lib/api/services/usdt.ts
 */

export * as bitcoin from "./bitcoin";
export * as usdt from "./usdt";
