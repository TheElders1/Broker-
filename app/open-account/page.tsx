import type { Metadata } from "next";
import AuthShell from "@/components/AuthShell";
import OpenAccountFlow from "./OpenAccountFlow";

export const metadata: Metadata = {
  title: "Open Account",
  description: "Open a Genesis Pro LTD trading account.",
  alternates: { canonical: "/open-account" },
};

export default function OpenAccountPage() {
  return (
    <AuthShell
      title="Open Your Account"
      subtitle="Fill in your details below to create your Genesis Pro LTD account."
      wide
    >
      <OpenAccountFlow />
    </AuthShell>
  );
}
