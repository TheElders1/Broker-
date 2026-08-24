import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/DashboardWidgets";
import AdminRequestsView from "./AdminRequestsView";

export const metadata: Metadata = { title: "Account Requests" };

export default function AdminRequestsPage() {
  return (
    <div>
      <PageHeader
        title="Account Requests"
        description="Submissions from the Open Account form. Copy the details or create the account directly."
      />
      <AdminRequestsView />
    </div>
  );
}
