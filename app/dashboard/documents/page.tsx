import type { Metadata } from "next";
import { PageHeader, Widget, EmptyState } from "@/components/dashboard/DashboardWidgets";

export const metadata: Metadata = { title: "Documents" };

export default function DocumentsPage() {
  return (
    <div>
      <PageHeader title="Documents" description="Manage your identity verification documents." />

      <Widget title="Uploaded Documents">
        <EmptyState
          icon="book"
          title="No documents uploaded"
          description="Document upload will be available once a verified KYC provider is connected to this platform."
          action={
            <button type="button" disabled className="btn-outline mt-2 cursor-not-allowed opacity-50">
              Upload Document
            </button>
          }
        />
      </Widget>
    </div>
  );
}
