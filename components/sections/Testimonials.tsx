import Icon from "@/components/Icon";
import { Section, SectionHeading } from "@/components/Section";
import { TESTIMONIALS } from "@/lib/data";

export default function Testimonials() {
  return (
    <Section className="bg-ink-900/30">
      <SectionHeading
        eyebrow="Testimonials"
        title="What Clients Say"
        description="The cards below are placeholders reserved for verified, consented client testimonials."
      />

      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="reveal glass-card flex flex-col gap-4 p-7"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/45">
              Sample Testimonial
            </span>
            <Icon name="strategy" className="h-6 w-6 text-gold-500/50" />
            <p className="flex-1 text-sm italic leading-relaxed text-white/65">“{t.quote}”</p>
            <div className="border-t border-white/10 pt-4">
              <p className="text-sm font-semibold text-white/80">{t.name}</p>
              <p className="text-xs text-white/40">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
