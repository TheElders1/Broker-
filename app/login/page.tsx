import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "@/components/AuthShell";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your Genesis Pro LTD account.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <AuthShell title="Welcome Back" subtitle="Log in to access your Genesis Pro LTD account.">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
