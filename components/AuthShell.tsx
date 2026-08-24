import Link from "next/link";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";

export default function AuthShell({
  title,
  subtitle,
  children,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-ink-950 bg-hero-radial">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Logo />
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-gold-300">
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Back to Home
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className={`w-full ${wide ? "max-w-3xl" : "max-w-md"}`}>
          <div className="reveal glass-card p-8 shadow-card sm:p-10">
            <div className="mb-8 text-center">
              <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                {title}
              </h1>
              {subtitle ? <p className="mt-2 text-sm text-white/55">{subtitle}</p> : null}
            </div>
            {children}
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-6 pb-8 text-center text-xs text-white/35">
        © 2026 Genesis Pro LTD. All rights reserved.
      </footer>
    </div>
  );
}
