import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/DashboardWidgets";
import PortfolioView from "./PortfolioView";

export const metadata: Metadata = { title: "Portfolio" };

export default function PortfolioPage() {
  return (
    <div>
      <PageHeader title="Portfolio" description="An overview of your account balance and positions." />
      <PortfolioView />
    </div>
  );
}
