import Icon from "@/components/Icon";
import { TRUST_STATS } from "@/lib/data";

export default function TrustStats() {
  return (
    <section className="relative border-y border-white/5 bg-ink-900/40 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_STATS.map((stat, i) => (
            <div
              key={stat.title}
              className="reveal glass-card card-hover flex flex-col gap-4 p-6"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-royal-500/15 text-royal-300">
                <Icon name={stat.icon} className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-semibold text-white">{stat.title}</h3>
              <p className="text-sm leading-relaxed text-white/55">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
