import Link from "next/link";
import Icon from "@/components/Icon";
import CandlestickChart from "@/components/CandlestickChart";
import LiveTicker from "@/components/LiveTicker";
import { RISK_DISCLAIMER } from "@/lib/data";

const SNAPSHOT_INSTRUMENTS = [
  { symbol: "EUR/USD", basePrice: 1.0842, decimals: 4 },
  { symbol: "BTC/USD", basePrice: 64210.5, decimals: 2 },
  { symbol: "US 500", basePrice: 5308.4, decimals: 2 },
];

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pb-24 pt-20 sm:pt-28 lg:pb-36 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.18] [mask-image:radial-gradient(ellipse_55%_55%_at_50%_0%,black,transparent)]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-8">
        <div className="reveal flex flex-col gap-8">
          <span className="section-eyebrow w-fit">Genesis Pro LTD</span>
          <h1 className="font-display text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
            Trade with
            <br />
            confidence.
            <br />
            <span className="text-white/35">Grow with purpose.</span>
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-white/55 sm:text-lg">
            Access global financial markets through a modern trading experience built around
            transparency, technology, and informed decision-making.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/open-account" className="btn-gold">
              Open an Account
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link
              href="/#markets"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white"
            >
              Explore Markets
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex items-start gap-2.5 pt-4 text-xs text-white/35">
            <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{RISK_DISCLAIMER}</p>
          </div>
        </div>

        <div className="reveal relative">
          <div className="glass-card relative overflow-hidden p-6 shadow-card sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/40">Market Snapshot</p>
                <p className="font-display text-2xl font-semibold text-white">XAU / USD</p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                Demo Data
              </span>
            </div>

            <div className="mt-6 h-56 w-full sm:h-64">
              <CandlestickChart className="h-full w-full" live />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-6">
              <LiveTicker instruments={SNAPSHOT_INSTRUMENTS} />
            </div>

            <div className="mt-6 flex items-center gap-2.5 border-t border-white/[0.07] pt-5">
              <Icon name="shield-check" className="h-4 w-4 shrink-0 text-gold-400/80" />
              <p className="text-xs text-white/40">
                Platform Security — <span className="text-white/60">Encrypted Access</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
