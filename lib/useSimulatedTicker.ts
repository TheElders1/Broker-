"use client";

import { useEffect, useState } from "react";

export type TickerInstrument = {
  symbol: string;
  basePrice: number;
  decimals: number;
};

export type TickerState = {
  price: number;
  changePercent: number;
  up: boolean;
};

/**
 * Client-side price simulation — NOT real market data. Nudges each
 * instrument's price by a small random walk on an interval so the demo
 * trading UI feels live instead of static, while every consumer still
 * carries a "Demo Data" badge alongside it. There is no live market-data
 * provider connected yet (see lib/api/config.ts); this exists purely so
 * the numbers move the way a real ticker would once one is.
 */
export function useSimulatedTicker(
  instruments: TickerInstrument[],
  intervalMs = 2200
): Record<string, TickerState> {
  const [state, setState] = useState<Record<string, TickerState>>(() =>
    Object.fromEntries(instruments.map((i) => [i.symbol, { price: i.basePrice, changePercent: 0, up: true }]))
  );

  useEffect(() => {
    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const id = setInterval(() => {
      setState((prev) => {
        const next = { ...prev };
        for (const inst of instruments) {
          const current = prev[inst.symbol]?.price ?? inst.basePrice;
          const drift = (Math.random() - 0.5) * 0.003;
          const price = Math.max(0, current * (1 + drift));
          const changePercent = ((price - inst.basePrice) / inst.basePrice) * 100;
          next[inst.symbol] = { price, changePercent, up: drift >= 0 };
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(id);
    // instruments is a static list per caller (defined outside render); only
    // intervalMs is meant to re-arm the interval.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs]);

  return state;
}

export function formatTickerPrice(price: number, decimals: number): string {
  return price.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
