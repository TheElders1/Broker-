import Icon from "@/components/Icon";
import { TRUST_STATS } from "@/lib/data";

export default function TrustStats() {
  return (
    <section className="relative border-y border-white/[0.06] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 divide-y divide-white/[0.06] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {TRUST_STATS.map((stat, i) => (
            <div
              key={stat.title}
              className="reveal flex flex-col gap-3 py-8 first:pt-0 sm:px-8 sm:py-0 sm:first:pl-0 last:pb-0"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <Icon name={stat.icon} className="h-5 w-5 text-gold-400/80" />
              <h3 className="font-display text-lg font-semibold text-white">{stat.title}</h3>
              <p className="text-sm leading-relaxed text-white/50">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
