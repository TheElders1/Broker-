import Icon from "@/components/Icon";
import { Section, SectionHeading } from "@/components/Section";
import { WHY_GENESIS_PRO } from "@/lib/data";

export default function WhyGenesisPro() {
  return (
    <Section id="why-genesis-pro" className="bg-ink-900/30">
      <SectionHeading eyebrow="Why Genesis Pro" title="Why Choose Genesis Pro LTD?" />

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {WHY_GENESIS_PRO.map((item, i) => (
          <div
            key={item.title}
            className="reveal glass-card card-hover flex flex-col gap-4 p-6"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
              <Icon name={item.icon} className="h-5 w-5" />
            </span>
            <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
            <p className="text-sm leading-relaxed text-white/55">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
