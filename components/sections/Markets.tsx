import Link from "next/link";
import Icon from "@/components/Icon";
import { Section, SectionHeading } from "@/components/Section";
import { MARKETS } from "@/lib/data";

export default function Markets() {
  return (
    <Section id="markets" className="bg-ink-900/30">
      <SectionHeading
        eyebrow="Markets"
        title="Explore Global Markets"
        description="Availability of specific instruments depends on account type, region, and regulatory considerations."
      />

      <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-xl2 bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
        {MARKETS.map((market, i) => (
          <div
            key={market.title}
            className="reveal flex flex-col gap-4 bg-ink-950 p-7 transition-colors duration-300 hover:bg-ink-900"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <Icon name={market.icon} className="h-6 w-6 text-gold-400/80" />
            <h3 className="font-display text-xl font-semibold text-white">{market.title}</h3>
            <p className="text-sm leading-relaxed text-white/50">{market.description}</p>
            <Link
              href="/#trading"
              className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-white"
            >
              Explore Market
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>

      <p className="reveal mt-10 text-center text-xs text-white/35">
        Instrument availability is not guaranteed for every account or jurisdiction. Confirm
        access with your account documentation before trading.
      </p>
    </Section>
  );
}
