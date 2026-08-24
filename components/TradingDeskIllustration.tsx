import Icon from "@/components/Icon";

export default function TradingDeskIllustration({ className = "" }: { className?: string }) {
  return (
    <div className={`glass-card relative overflow-hidden p-6 shadow-card sm:p-8 ${className}`}>
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-royal-500/20 blur-3xl" />

      <div className="relative grid grid-cols-3 gap-3">
        <div className="col-span-2 rounded-xl border border-white/10 bg-ink-900/70 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-white/40">Primary Monitor</span>
            <Icon name="trending" className="h-4 w-4 text-gold-400" />
          </div>
          <div className="flex h-28 items-end gap-1.5">
            {[40, 55, 35, 65, 50, 72, 46, 80, 60, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-royal-600 to-royal-300"
                style={{ height: `${h}%`, opacity: 0.85 }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-white/10 bg-ink-900/70 p-4">
            <span className="text-[11px] uppercase tracking-wider text-white/40">Watchlist</span>
            <div className="mt-3 flex flex-col gap-2">
              {["EUR/USD", "GBP/USD", "XAU/USD"].map((p) => (
                <div key={p} className="flex items-center justify-between text-xs">
                  <span className="text-white/60">{p}</span>
                  <span className="h-1.5 w-10 rounded-full bg-gold-500/50" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-ink-900/70 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-gradient text-ink-950">
              <Icon name="bolt" className="h-5 w-5" />
            </span>
          </div>
        </div>

        <div className="col-span-3 rounded-xl border border-white/10 bg-ink-900/70 p-4">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-white/40">
            <span>Second Monitor — Order Panel</span>
            <span>Demo</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-royal-500/15 px-3 py-2 text-center text-xs font-semibold text-royal-200">
              Buy
            </div>
            <div className="rounded-lg bg-white/5 px-3 py-2 text-center text-xs font-semibold text-white/60">
              Positions
            </div>
            <div className="rounded-lg bg-gold-500/15 px-3 py-2 text-center text-xs font-semibold text-gold-300">
              Sell
            </div>
          </div>
        </div>
      </div>

      <p className="relative mt-6 text-center text-xs text-white/35">
        Illustrative representation of a multi-monitor trading setup.
      </p>
    </div>
  );
}
