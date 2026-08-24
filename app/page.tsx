import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import TrustStats from "@/components/sections/TrustStats";
import About from "@/components/sections/About";
import Markets from "@/components/sections/Markets";
import TradingPlatform from "@/components/sections/TradingPlatform";
import WhyGenesisPro from "@/components/sections/WhyGenesisPro";
import AccountTypes from "@/components/sections/AccountTypes";
import Education from "@/components/sections/Education";
import RiskManagement from "@/components/sections/RiskManagement";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <TrustStats />
        <About />
        <Markets />
        <TradingPlatform />
        <WhyGenesisPro />
        <AccountTypes />
        <Education />
        <RiskManagement />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
