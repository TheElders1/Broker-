import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";

export type ArticleSection = {
  heading: string;
  body: string[];
};

export default function ArticlePage({
  eyebrow,
  title,
  intro,
  sections,
  backHref,
  backLabel,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  sections: ArticleSection[];
  backHref: string;
  backLabel: string;
}) {
  return (
    <>
      <Header />
      <main id="main-content" className="bg-ink-950">
        <div className="border-b border-white/10 py-16">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <Link
              href={backHref}
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-white"
            >
              <Icon name="arrow" className="h-4 w-4 rotate-180" />
              {backLabel}
            </Link>
            <span className="section-eyebrow w-fit">{eyebrow}</span>
            <h1 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
            {intro ? <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60">{intro}</p> : null}
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
          <div className="flex flex-col gap-10">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-xl font-semibold text-white">{section.heading}</h2>
                <div className="mt-3 flex flex-col gap-3">
                  {section.body.map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed text-white/60">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 flex items-start gap-3 rounded-xl2 border border-gold-500/20 bg-gold-500/[0.05] p-5">
            <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
            <p className="text-sm leading-relaxed text-white/70">
              This article is general educational content, not investment advice. Trading
              financial instruments involves significant risk and may not be suitable for all
              investors. You may lose some or all of your invested capital.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
