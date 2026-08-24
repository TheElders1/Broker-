import { apiFetch } from "../client";
import { IS_DEMO_MODE } from "../config";
import { MOCK_WALLET, mockDelay } from "../mock";
import type { WalletSummary } from "../types";

/**
 * Backend contract:
 *   GET  /wallet/summary                     -> WalletSummary
 *   POST /wallet/transfer  { from, to, asset, amount } -> 204
 *
 * Balances must always be authoritative values returned by the backend —
 * the frontend never computes or trusts a client-supplied balance.
 */

export async function getWalletSummary(): Promise<WalletSummary> {
  if (IS_DEMO_MODE) return mockDelay(MOCK_WALLET);
  return apiFetch<WalletSummary>("/wallet/summary");
}

export type TransferRequest = {
  fromAsset: string;
  toAsset: string;
  amount: number;
};

export async function transferFunds(req: TransferRequest): Promise<void> {
  if (IS_DEMO_MODE) return mockDelay(undefined, 500);
  await apiFetch<void>("/wallet/transfer", { method: "POST", body: req });
}
