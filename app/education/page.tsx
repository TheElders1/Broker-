import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Education from "@/components/sections/Education";

export const metadata: Metadata = {
  title: "Education",
  description:
    "Educational guides covering trading fundamentals, technical analysis, risk management, and market psychology.",
  alternates: { canonical: "/education" },
};

export default function EducationPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Education />
      </main>
      <Footer />
    </>
  );
}
