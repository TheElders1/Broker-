import Link from "next/link";
import Icon from "@/components/Icon";
import { Section, SectionHeading } from "@/components/Section";
import { RISK_TOPICS } from "@/lib/data";

export default function RiskManagement() {
  return (
    <Section id="risk-management">
      <SectionHeading
        eyebrow="Risk Management"
        title="Trade Responsibly"
        description="Trading involves substantial risk. Understanding these concepts is an important part of preparing to trade — it does not eliminate risk."
      />

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {RISK_TOPICS.map((topic, i) => (
          <div
            key={topic.title}
            className="reveal flex flex-col gap-3 rounded-xl2 border border-white/10 bg-white/[0.02] p-6"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
              <Icon name="shield-check" className="h-4 w-4" />
            </span>
            <h3 className="font-display text-base font-semibold text-white">{topic.title}</h3>
            <p className="text-sm leading-relaxed text-white/55">{topic.description}</p>
          </div>
        ))}
      </div>

      <div className="reveal mt-10 flex items-start gap-3 rounded-xl2 border border-gold-500/25 bg-gold-500/[0.06] p-6">
        <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
        <p className="text-sm leading-relaxed text-white/70">
          Trading involves substantial risk of loss and is not suitable for all investors.
          You should carefully consider your objectives, experience level, and risk appetite,
          and seek independent advice if necessary, before trading. Please read our{" "}
          <Link href="/legal/risk-disclosure" className="font-semibold text-gold-300 underline underline-offset-2">
            Risk Disclosure
          </Link>{" "}
          in full.
        </p>
      </div>
    </Section>
  );
}
