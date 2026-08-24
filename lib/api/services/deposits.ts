import { getDepositAddress, listDeposits } from "./bitcoin";

/**
 * General deposits entry point. Bitcoin is the currently supported
 * deposit method; this module re-exports the Bitcoin-specific service so
 * additional deposit rails (e.g. bank transfer) can be added here later
 * without changing call sites.
 *
 * Backend contract: see lib/api/services/bitcoin.ts
 */

export { getDepositAddress, listDeposits };
