import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import About from "@/components/sections/About";
import Testimonials from "@/components/sections/Testimonials";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Genesis Pro LTD's approach to transparency, technology, and client support in modern trading.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <About />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
