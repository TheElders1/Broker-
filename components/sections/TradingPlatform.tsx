import Link from "next/link";
import Icon from "@/components/Icon";
import { Section, SectionHeading } from "@/components/Section";
import TradingDashboardMockup from "@/components/TradingDashboardMockup";

export default function TradingPlatform() {
  return (
    <Section id="trading">
      <SectionHeading
        eyebrow="Trading Platform"
        title="A Smarter Trading Experience"
        description="A preview of the trading interface. Figures shown are demo data for illustration only, unless connected to a live market-data provider."
      />

      <div className="reveal mt-14">
        <TradingDashboardMockup />
      </div>

      <div className="reveal mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link href="/open-account" className="btn-gold">
          Start Trading
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
        <Link href="/#education" className="btn-outline">
          Learn More
        </Link>
      </div>
    </Section>
  );
}
