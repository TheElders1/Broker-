import { apiFetch } from "../client";
import { IS_DEMO_MODE } from "../config";
import { MOCK_TRANSACTIONS, mockDelay } from "../mock";
import type { Transaction } from "../types";

/**
 * Backend contract:
 *   GET /transactions   -> Transaction[]
 */

export async function listTransactions(): Promise<Transaction[]> {
  if (IS_DEMO_MODE) return mockDelay(MOCK_TRANSACTIONS);
  return apiFetch<Transaction[]>("/transactions");
}
