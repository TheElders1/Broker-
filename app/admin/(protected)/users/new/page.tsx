import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/dashboard/DashboardWidgets";
import CreateUserForm from "./CreateUserForm";

export const metadata: Metadata = { title: "Create User" };

export default function CreateUserPage() {
  return (
    <div>
      <PageHeader title="Create User" description="Manually create a client account." />
      <Suspense fallback={null}>
        <CreateUserForm />
      </Suspense>
    </div>
  );
}
