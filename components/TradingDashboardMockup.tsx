import Icon from "@/components/Icon";
import CandlestickChart from "@/components/CandlestickChart";
import DemoBadge from "@/components/DemoBadge";
import LineSpark from "@/components/LineSpark";

const WATCHLIST = [
  { symbol: "EUR/USD", price: "1.0842", change: "+0.24%", up: true },
  { symbol: "GBP/USD", price: "1.2715", change: "-0.11%", up: false },
  { symbol: "XAU/USD", price: "2,342.10", change: "+0.62%", up: true },
  { symbol: "BTC/USD", price: "64,210", change: "+1.35%", up: true },
  { symbol: "US 500", price: "5,308.4", change: "-0.08%", up: false },
];

export default function TradingDashboardMockup({ className = "" }: { className?: string }) {
  return (
    <div className={`glass-card relative overflow-hidden p-4 shadow-card sm:p-6 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-gradient text-ink-950">
            <Icon name="chart" className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-base font-semibold text-white">Trading Dashboard</p>
            <p className="text-xs text-white/40">Illustrative preview</p>
          </div>
        </div>
        <DemoBadge />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        {/* Chart + order panel */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-white/10 bg-ink-900/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/40">XAU/USD</p>
                <p className="font-display text-xl font-semibold text-white">2,342.10</p>
              </div>
              <div className="flex gap-2">
                {["1H", "4H", "1D", "1W"].map((t, i) => (
                  <span
                    key={t}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                      i === 2 ? "bg-gold-500/20 text-gold-300" : "text-white/40"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 h-40 w-full sm:h-52">
              <CandlestickChart className="h-full w-full" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["RSI", "MACD", "MA (50)", "Bollinger Bands"].map((ind) => (
                <span
                  key={ind}
                  className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/50"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-royal-400/25 bg-royal-500/10 p-4">
              <p className="text-xs uppercase tracking-wide text-royal-300">Buy / Long</p>
              <p className="mt-1 font-display text-lg font-semibold text-white">2,342.35</p>
              <button
                type="button"
                disabled
                className="mt-3 w-full cursor-not-allowed rounded-lg bg-royal-gradient py-2 text-sm font-semibold text-white opacity-90"
              >
                Buy
              </button>
            </div>
            <div className="rounded-xl border border-gold-500/25 bg-gold-500/10 p-4">
              <p className="text-xs uppercase tracking-wide text-gold-300">Sell / Short</p>
              <p className="mt-1 font-display text-lg font-semibold text-white">2,341.85</p>
              <button
                type="button"
                disabled
                className="mt-3 w-full cursor-not-allowed rounded-lg bg-gold-gradient py-2 text-sm font-semibold text-ink-950 opacity-90"
              >
                Sell
              </button>
            </div>
          </div>
        </div>

        {/* Watchlist + portfolio */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-white/10 bg-ink-900/60 p-4">
            <p className="mb-3 text-xs uppercase tracking-wide text-white/40">Watchlist</p>
            <div className="flex flex-col divide-y divide-white/5">
              {WATCHLIST.map((row) => (
                <div key={row.symbol} className="flex items-center justify-between py-2.5">
                  <span className="text-sm text-white/75">{row.symbol}</span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{row.price}</p>
                    <p className={`text-[11px] ${row.up ? "text-emerald-400" : "text-rose-400"}`}>
                      {row.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-ink-900/60 p-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-white/40">Portfolio Overview</p>
            <p className="font-display text-2xl font-semibold text-white">$0.00</p>
            <div className="mt-2 h-16 w-full">
              <LineSpark points={[10, 14, 12, 18, 16, 22, 20, 26]} color="#E6C264" />
            </div>
            <p className="mt-2 text-[11px] text-white/40">Demo balance — no real funds connected.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
