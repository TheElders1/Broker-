import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQ from "@/components/sections/FAQ";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Genesis Pro LTD accounts, markets, and trading.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
