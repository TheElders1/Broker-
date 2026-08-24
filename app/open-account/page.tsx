import type { Metadata } from "next";
import AuthShell from "@/components/AuthShell";
import OpenAccountFlow from "./OpenAccountFlow";

export const metadata: Metadata = {
  title: "Open Account",
  description: "Open a Genesis Pro LTD trading account in a few guided steps.",
};

export default function OpenAccountPage() {
  return (
    <AuthShell
      title="Open Your Account"
      subtitle="Complete the steps below to begin your Genesis Pro LTD application."
      wide
    >
      <OpenAccountFlow />
    </AuthShell>
  );
}
