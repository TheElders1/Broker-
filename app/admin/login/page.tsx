import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "@/components/AuthShell";
import AdminLoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <AuthShell title="Admin Sign In" subtitle="Genesis Pro LTD internal admin area.">
      <Suspense fallback={null}>
        <AdminLoginForm />
      </Suspense>
    </AuthShell>
  );
}
