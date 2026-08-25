import { apiFetch } from "../client";
import { IS_DEMO_MODE } from "../config";
import { MOCK_PORTFOLIO, MOCK_POSITIONS, mockDelay } from "../mock";
import type { PortfolioSummary, Position } from "../types";
import { IS_SUPABASE_CONFIGURED } from "@/lib/supabaseMode";
import { createClient } from "@/utils/supabase/client";

/**
 * Backend contract:
 *   GET /portfolio/summary     -> PortfolioSummary
 *   GET /portfolio/positions   -> Position[]
 *
 * When Supabase is configured, balance/availableFunds come from the real
 * profiles.balance_usd an admin sets (see app/api/admin/users/[id]/balance).
 * P/L and the equity curve stay at zero/flat — there's no live trading
 * engine writing real positions or price history yet, so nothing here
 * fabricates gains or losses.
 */

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  if (IS_SUPABASE_CONFIGURED) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not signed in.");

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("balance_usd")
      .eq("id", user.id)
      .single();
    if (error || !profile) throw new Error("Could not load your balance.");

    const balance = profile.balance_usd as number;
    return {
      balance,
      availableFunds: balance,
      unrealizedPl: 0,
      todayPl: 0,
      todayPlPercent: 0,
      equityCurve: Array(8).fill(balance),
    };
  }
  if (IS_DEMO_MODE) return mockDelay(MOCK_PORTFOLIO);
  return apiFetch<PortfolioSummary>("/portfolio/summary");
}

export async function listPositions(): Promise<Position[]> {
  if (IS_SUPABASE_CONFIGURED) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not signed in.");

    const { data, error } = await supabase
      .from("positions")
      .select("id, symbol, side, size, entry_price, current_price, pl")
      .eq("user_id", user.id)
      .order("opened_at", { ascending: false });
    if (error) throw new Error(error.message);

    return (data ?? []).map((p) => ({
      id: p.id,
      symbol: p.symbol,
      side: p.side,
      size: p.size,
      entryPrice: p.entry_price,
      currentPrice: p.current_price,
      pl: p.pl,
    }));
  }
  if (IS_DEMO_MODE) return mockDelay(MOCK_POSITIONS);
  return apiFetch<Position[]>("/portfolio/positions");
}
