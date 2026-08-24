import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RiskManagement from "@/components/sections/RiskManagement";

export const metadata: Metadata = {
  title: "Risk Management",
  description: "Core risk management concepts every trader should understand before trading financial markets.",
  alternates: { canonical: "/risk-management" },
};

export default function RiskManagementPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <RiskManagement />
      </main>
      <Footer />
    </>
  );
}
