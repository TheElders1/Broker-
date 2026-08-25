import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";

export type LegalSection = {
  heading: string;
  body: string[];
};

export default function LegalPage({
  title,
  intro,
  sections,
  lastUpdated,
}: {
  title: string;
  intro?: string;
  sections: LegalSection[];
  /** Omit until there's a real date — no line is shown rather than a placeholder. */
  lastUpdated?: string;
}) {
  const hasPlaceholders = sections.some((section) => section.body.some((p) => p.includes("[Insert")));

  return (
    <>
      <Header />
      <main id="main-content" className="bg-ink-950">
        <div className="border-b border-white/10 bg-hero-radial py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <span className="section-eyebrow w-fit">Legal</span>
            <h1 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
              {title}
            </h1>
            {lastUpdated ? (
              <p className="mt-3 text-sm text-white/45">Last updated: {lastUpdated}</p>
            ) : null}
            {intro ? (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60">{intro}</p>
            ) : null}
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
          {hasPlaceholders ? (
            <div className="mb-10 flex items-start gap-3 rounded-xl2 border border-gold-500/25 bg-gold-500/[0.06] p-5">
              <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
              <p className="text-sm leading-relaxed text-white/70">
                This page contains placeholder sections marked with brackets, such as{" "}
                <span className="font-mono text-gold-300">[Insert verified information]</span>.
                These must be completed with accurate, verified company and legal information
                before this page is relied upon.
              </p>
            </div>
          ) : null}

          <div className="flex flex-col gap-10">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-xl font-semibold text-white">
                  {section.heading}
                </h2>
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
        </div>
      </main>
      <Footer />
    </>
  );
}
