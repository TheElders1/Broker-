import Link from "next/link";
import Icon from "@/components/Icon";
import { Section, SectionHeading } from "@/components/Section";
import { ACCOUNT_TYPES } from "@/lib/data";

export default function AccountTypes() {
  return (
    <Section id="accounts">
      <SectionHeading
        eyebrow="Account Types"
        title="Choose the account that fits your trading needs"
        description="All figures below are placeholders pending verified company information — final terms will be confirmed before account opening."
      />

      <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {ACCOUNT_TYPES.map((account, i) => (
          <div
            key={account.name}
            className={`reveal relative flex flex-col rounded-xl2 border p-7 transition-all duration-300 hover:-translate-y-0.5 ${
              account.featured
                ? "border-gold-500/30 bg-gradient-to-b from-gold-500/[0.06] to-transparent shadow-glow"
                : "border-white/[0.08] bg-white/[0.015] hover:border-white/[0.16]"
            }`}
            style={{ animationDelay: `${i * 90}ms` }}
          >
            {account.featured ? (
              <span className="absolute -top-3 left-7 rounded-full bg-gold-gradient px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-950">
                Most Popular
              </span>
            ) : null}
            <h3 className="font-display text-2xl font-semibold text-white">{account.name}</h3>
            <p className="mt-1 text-sm text-white/50">{account.tagline}</p>

            <ul className="mt-6 flex flex-1 flex-col gap-3">
              {account.fields.map((field) => (
                <li key={field.label} className="flex flex-col gap-0.5 border-b border-white/5 pb-3">
                  <span className="text-[11px] uppercase tracking-wide text-white/40">
                    {field.label}
                  </span>
                  <span className="text-sm font-medium text-white/85">{field.value}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/open-account"
              className={account.featured ? "btn-gold mt-7 w-full" : "btn-outline mt-7 w-full"}
            >
              Open Account
              <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </Section>
  );
}
