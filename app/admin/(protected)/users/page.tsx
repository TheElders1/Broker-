import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/DashboardWidgets";
import AdminUsersView from "./AdminUsersView";

export const metadata: Metadata = { title: "Users" };

export default function AdminUsersPage() {
  return (
    <div>
      <PageHeader title="Users" description="View, fund, and manage client accounts." />
      <AdminUsersView />
    </div>
  );
}
