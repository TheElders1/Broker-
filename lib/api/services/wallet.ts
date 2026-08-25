import { apiFetch } from "../client";
import { IS_DEMO_MODE } from "../config";
import { MOCK_WALLET, mockDelay } from "../mock";
import type { WalletSummary } from "../types";
import { IS_SUPABASE_CONFIGURED } from "@/lib/supabaseMode";
import { createClient } from "@/utils/supabase/client";

/**
 * Backend contract:
 *   GET  /wallet/summary                     -> WalletSummary
 *   POST /wallet/transfer  { from, to, asset, amount } -> 204
 *
 * Balances must always be authoritative values returned by the backend —
 * the frontend never computes or trusts a client-supplied balance.
 *
 * When Supabase is configured, the USD figure comes from the real
 * profiles.balance_usd an admin sets. BTC/USDT come from wallet_balances,
 * which stays empty until the VPS/Bitcoin backend is connected and starts
 * writing real crypto balances there.
 */

export async function getWalletSummary(): Promise<WalletSummary> {
  if (IS_SUPABASE_CONFIGURED) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not signed in.");

    const [{ data: profile, error: profileError }, { data: cryptoBalances, error: walletError }] = await Promise.all([
      supabase.from("profiles").select("balance_usd").eq("id", user.id).single(),
      supabase.from("wallet_balances").select("asset, total, available, pending").eq("user_id", user.id),
    ]);
    if (profileError || !profile) throw new Error("Could not load your balance.");
    if (walletError) throw new Error(walletError.message);

    const usdBalance = profile.balance_usd as number;
    const assets = [
      { asset: "USD", total: usdBalance, available: usdBalance, pending: 0 },
      ...(cryptoBalances ?? []).map((b) => ({
        asset: b.asset,
        total: b.total,
        available: b.available,
        pending: b.pending,
      })),
    ];

    return {
      totalBalanceUsd: usdBalance,
      availableBalanceUsd: usdBalance,
      pendingBalanceUsd: 0,
      assets,
    };
  }
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
