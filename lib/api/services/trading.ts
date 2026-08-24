import { apiFetch } from "../client";
import { IS_DEMO_MODE } from "../config";
import { mockDelay } from "../mock";
import type { Position } from "../types";

/**
 * Backend contract:
 *   POST /trading/orders   { symbol, side, orderType, quantity } -> Position
 *   DELETE /trading/positions/:id -> 204
 *
 * The frontend never calculates fills, prices, or P/L itself — all of
 * that must be authoritative data returned by the backend.
 */

export type OrderRequest = {
  symbol: string;
  side: "Buy" | "Sell";
  orderType: "Market" | "Limit" | "Stop";
  quantity: number;
};

export async function placeOrder(order: OrderRequest): Promise<Position> {
  if (IS_DEMO_MODE) {
    return mockDelay(
      {
        id: `demo-${Date.now()}`,
        symbol: order.symbol,
        side: order.side,
        size: order.quantity,
        entryPrice: 0,
        currentPrice: 0,
        pl: 0,
      },
      600
    );
  }
  return apiFetch<Position>("/trading/orders", { method: "POST", body: order });
}

export async function closePosition(positionId: string): Promise<void> {
  if (IS_DEMO_MODE) return mockDelay(undefined, 400);
  await apiFetch<void>(`/trading/positions/${encodeURIComponent(positionId)}`, { method: "DELETE" });
}
