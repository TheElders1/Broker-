import type { Metadata } from "next";
import AdminOverview from "./AdminOverview";

export const metadata: Metadata = { title: "Overview" };

export default function AdminPage() {
  return <AdminOverview />;
}
