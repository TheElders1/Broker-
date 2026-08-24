import { listWithdrawals, requestWithdrawal } from "./bitcoin";

/**
 * General withdrawals entry point. Bitcoin is the currently supported
 * withdrawal method; this module re-exports the Bitcoin-specific service
 * so additional withdrawal rails can be added later without changing
 * call sites.
 *
 * Backend contract: see lib/api/services/bitcoin.ts
 */

export { listWithdrawals, requestWithdrawal };
