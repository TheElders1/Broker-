import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import TrustStats from "@/components/sections/TrustStats";
import Markets from "@/components/sections/Markets";
import TradingPlatform from "@/components/sections/TradingPlatform";
import WhyGenesisPro from "@/components/sections/WhyGenesisPro";
import AccountTypes from "@/components/sections/AccountTypes";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <TrustStats />
        <Markets />
        <TradingPlatform />
        <WhyGenesisPro />
        <AccountTypes />
      </main>
      <Footer />
    </>
  );
}
