import Icon from "@/components/Icon";
import { Section, SectionHeading } from "@/components/Section";
import TradingDeskIllustration from "@/components/TradingDeskIllustration";
import { ABOUT_FEATURES } from "@/lib/data";

export default function About() {
  return (
    <Section id="about">
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12">
        <div className="reveal flex flex-col gap-6">
          <span className="section-eyebrow w-fit">About Genesis Pro</span>
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl lg:text-[2.75rem]">
            Built Around Your Trading Journey
          </h2>
          <p className="text-base leading-relaxed text-white/60 sm:text-lg">
            Genesis Pro LTD aims to provide a modern environment for accessing financial
            markets and trading tools. Our platform is designed to bring clarity to complex
            markets, combining thoughtful technology with resources that support informed
            decision-making at every stage of your trading journey.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {ABOUT_FEATURES.map((feature) => (
              <div key={feature.title} className="glass-card card-hover flex flex-col gap-3 p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
                  <Icon name={feature.icon} className="h-5 w-5" />
                </span>
                <h3 className="font-display text-base font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/55">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal">
          <TradingDeskIllustration />
        </div>
      </div>
    </Section>
  );
}
