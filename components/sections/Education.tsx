import Link from "next/link";
import Icon from "@/components/Icon";
import { Section, SectionHeading } from "@/components/Section";
import { EDUCATION_TOPICS } from "@/lib/data";

export default function Education() {
  return (
    <Section id="education" className="bg-ink-900/30">
      <SectionHeading eyebrow="Education" title="Learn. Trade. Improve." />

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {EDUCATION_TOPICS.map((topic, i) => (
          <div
            key={topic.title}
            className="reveal glass-card card-hover flex flex-col gap-4 p-6"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-royal-gradient text-white">
              <Icon name={topic.icon} className="h-6 w-6" />
            </span>
            <h3 className="font-display text-lg font-semibold text-white">{topic.title}</h3>
            <p className="text-sm leading-relaxed text-white/55">{topic.description}</p>
            <Link
              href={`/education/${topic.slug}`}
              className="mt-auto inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-gold-400 transition-colors hover:text-gold-300"
            >
              Read More
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </Section>
  );
}
