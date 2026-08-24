import Link from "next/link";
import Icon from "@/components/Icon";
import CandlestickChart from "@/components/CandlestickChart";
import { RISK_DISCLAIMER } from "@/lib/data";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-hero-radial pb-20 pt-16 sm:pt-24 lg:pb-28 lg:pt-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="reveal flex flex-col gap-7">
          <span className="section-eyebrow w-fit">Genesis Pro LTD</span>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-[3.4rem]">
            Trade With Confidence.
            <br />
            <span className="bg-gold-gradient bg-clip-text text-transparent">
              Grow With Purpose.
            </span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            Access global financial markets through a modern trading experience designed
            around transparency, technology, and informed decision-making.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/open-account" className="btn-gold">
              Open an Account
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link href="/#markets" className="btn-outline">
              Explore Markets
            </Link>
          </div>

          <div className="flex items-start gap-2.5 pt-2 text-xs text-white/45">
            <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/70" />
            <p>{RISK_DISCLAIMER}</p>
          </div>
        </div>

        <div className="reveal relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-royal-gradient opacity-20 blur-3xl" />
          <div className="glass-card relative overflow-hidden p-6 shadow-card sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/45">Market Snapshot</p>
                <p className="font-display text-2xl font-semibold text-white">XAU / USD</p>
              </div>
              <span className="rounded-full border border-royal-400/40 bg-royal-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-royal-300">
                Demo Data
              </span>
            </div>

            <div className="mt-6 h-56 w-full sm:h-64">
              <CandlestickChart className="h-full w-full" />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
              {[
                { label: "EUR/USD", value: "1.0842" },
                { label: "BTC/USD", value: "—" },
                { label: "US 500", value: "—" },
              ].map((row) => (
                <div key={row.label} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                  <p className="text-[11px] uppercase tracking-wide text-white/40">{row.label}</p>
                  <p className="mt-1 text-sm font-semibold text-white/85">{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-white/10 bg-ink-900/90 p-4 shadow-glow-blue backdrop-blur sm:block animate-float">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-gradient text-ink-950">
                <Icon name="shield-check" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-white/45">Platform Security</p>
                <p className="text-sm font-semibold text-white">Encrypted Access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
