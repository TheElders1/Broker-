"use client";

import { useSimulatedTicker, formatTickerPrice, type TickerInstrument } from "@/lib/useSimulatedTicker";

export default function LiveTicker({ instruments }: { instruments: TickerInstrument[] }) {
  const ticks = useSimulatedTicker(instruments);

  return (
    <>
      {instruments.map((inst) => {
        const tick = ticks[inst.symbol];
        return (
          <div key={inst.symbol}>
            <p className="text-[11px] uppercase tracking-wide text-white/35">{inst.symbol}</p>
            <p
              className={`mt-1 text-sm font-semibold tabular-nums transition-colors duration-300 ${
                tick.up ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {formatTickerPrice(tick.price, inst.decimals)}
            </p>
          </div>
        );
      })}
    </>
  );
}
