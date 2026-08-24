import Link from "next/link";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";
import { FOOTER_NAV, LEGAL_LINKS, FOOTER_RISK_WARNING, SOCIAL_LINKS } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink-900">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-white/55">
              Genesis Pro LTD provides a modern, technology-driven environment for accessing
              global financial markets. This site is for informational purposes and does not
              constitute investment advice.
            </p>
            {SOCIAL_LINKS.length > 0 ? (
              <div className="flex gap-3 pt-2">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-gold-400/50 hover:text-gold-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/80">
              Company
            </h3>
            <ul className="flex flex-col gap-3">
              {FOOTER_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/80">
              Legal
            </h3>
            <ul className="flex flex-col gap-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex items-start gap-3 rounded-xl2 border border-gold-500/20 bg-gold-500/[0.05] p-5">
          <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
          <p className="text-sm leading-relaxed text-white/70">{FOOTER_RISK_WARNING}</p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© 2026 Genesis Pro LTD. All rights reserved.</p>
          <p>Genesis Pro LTD — Financial Brokerage Platform</p>
        </div>
      </div>
    </footer>
  );
}
