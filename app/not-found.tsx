import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-hero-radial px-6 py-20">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" />
        <div className="relative flex flex-col items-center gap-5 text-center">
          <span className="section-eyebrow">Error 404</span>
          <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">
            Page Not <span className="bg-gold-gradient bg-clip-text text-transparent">Found</span>
          </h1>
          <p className="max-w-md text-base text-white/55">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="btn-gold">
              <Icon name="arrow" className="h-4 w-4 rotate-180" />
              Back to Homepage
            </Link>
            <Link href="/#contact" className="btn-outline">
              Contact Support
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
