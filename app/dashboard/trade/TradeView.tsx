"use client";

import { useMemo, useState } from "react";
import CandlestickChart from "@/components/CandlestickChart";
import { LoadingBlock, ErrorBlock } from "@/components/dashboard/ResourceState";
import { useApiResource } from "@/lib/useApiResource";
import { listMarkets } from "@/lib/api/services/markets";
import { useSimulatedTicker, formatTickerPrice } from "@/lib/useSimulatedTicker";
import TradeTicket from "./TradeTicket";

const TIMEFRAMES = ["1H", "4H", "1D", "1W"];
const INDICATORS = ["RSI", "MACD", "MA (50)", "Bollinger Bands"];

function decimalsFor(price: number): number {
  if (price >= 100) return 2;
  if (price >= 10) return 3;
  return 4;
}

export default function TradeView() {
  const markets = useApiResource(listMarkets, []);
  const [symbol, setSymbol] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState("1D");

  const activeMarket =
    markets.status === "success"
      ? markets.data.find((m) => m.symbol === symbol) ?? markets.data[0]
      : undefined;

  const decimals = activeMarket ? decimalsFor(activeMarket.price) : 2;
  const tickInstruments = useMemo(
    () => (activeMarket ? [{ symbol: activeMarket.symbol, basePrice: activeMarket.price, decimals }] : []),
    [activeMarket, decimals]
  );
  const ticks = useSimulatedTicker(tickInstruments);
  const tick = activeMarket ? ticks[activeMarket.symbol] : undefined;
  const price = tick?.price ?? activeMarket?.price ?? 0;
  const changePercent = tick?.changePercent ?? activeMarket?.changePercent ?? 0;
  const up = tick ? tick.up : changePercent >= 0;

  // Illustrative spread — a fixed fraction of price, not a real quoted spread.
  const spread = price * 0.00025;
  const bid = price - spread / 2;
  const ask = price + spread / 2;
  const dayHigh = price * 1.006;
  const dayLow = price * 0.994;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
      <div className="glass-card p-5 sm:p-6">
        {markets.status === "loading" ? (
          <LoadingBlock />
        ) : markets.status === "error" ? (
          <ErrorBlock message={markets.error} onRetry={markets.reload} />
        ) : !activeMarket ? (
          <p className="text-sm text-white/50">No instruments available.</p>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs uppercase tracking-wide text-white/40">{activeMarket.category}</p>
                </div>
                <div className="mt-1 flex items-baseline gap-3">
                  <h2 className="font-display text-2xl font-semibold text-white">{activeMarket.symbol}</h2>
                  <p className={`font-display text-2xl font-semibold tabular-nums ${up ? "text-emerald-400" : "text-rose-400"}`}>
                    {formatTickerPrice(price, decimals)}
                  </p>
                  <span className={`text-sm font-medium tabular-nums ${up ? "text-emerald-400" : "text-rose-400"}`}>
                    {changePercent >= 0 ? "+" : ""}
                    {changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="flex gap-1.5">
                {TIMEFRAMES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeframe(t)}
                    className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      t === timeframe ? "bg-gold-500/20 text-gold-300" : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 h-64 w-full sm:h-80">
              <CandlestickChart className="h-full w-full" live />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-5 sm:grid-cols-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-white/35">Bid</p>
                <p className="mt-0.5 text-sm font-medium tabular-nums text-white/85">{formatTickerPrice(bid, decimals)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-white/35">Ask</p>
                <p className="mt-0.5 text-sm font-medium tabular-nums text-white/85">{formatTickerPrice(ask, decimals)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-white/35">Day High</p>
                <p className="mt-0.5 text-sm font-medium tabular-nums text-white/85">{formatTickerPrice(dayHigh, decimals)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-white/35">Day Low</p>
                <p className="mt-0.5 text-sm font-medium tabular-nums text-white/85">{formatTickerPrice(dayLow, decimals)}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {INDICATORS.map((ind) => (
                <span key={ind} className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/50">
                  {ind}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <TradeTicket
        markets={markets.status === "success" ? markets.data : []}
        symbol={activeMarket?.symbol}
        onSymbolChange={setSymbol}
        currentPrice={price}
        bid={bid}
        ask={ask}
        decimals={decimals}
      />
    </div>
  );
}
