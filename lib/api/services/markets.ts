import { apiFetch } from "../client";
import { IS_DEMO_MODE } from "../config";
import { MOCK_MARKETS, mockDelay } from "../mock";
import type { MarketInstrument } from "../types";

/**
 * Backend contract:
 *   GET /markets              -> MarketInstrument[]
 *   GET /markets/:symbol      -> MarketInstrument
 *
 * In production this should be backed by a licensed live market-data feed.
 */

export async function listMarkets(): Promise<MarketInstrument[]> {
  if (IS_DEMO_MODE) return mockDelay(MOCK_MARKETS);
  return apiFetch<MarketInstrument[]>("/markets");
}

export async function getMarket(symbol: string): Promise<MarketInstrument | undefined> {
  if (IS_DEMO_MODE) return mockDelay(MOCK_MARKETS.find((m) => m.symbol === symbol));
  return apiFetch<MarketInstrument>(`/markets/${encodeURIComponent(symbol)}`);
}
