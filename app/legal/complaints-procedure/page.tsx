import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Complaints Procedure",
  description: "How to raise a complaint with Genesis Pro LTD and what to expect.",
  alternates: { canonical: "/legal/complaints-procedure" },
};

export default function ComplaintsProcedurePage() {
  return (
    <LegalPage
      title="Complaints Procedure"
      intro="Genesis Pro LTD aims to handle any concerns fairly and promptly. This page outlines how to raise a complaint."
      sections={[
        {
          heading: "1. How to Submit a Complaint",
          body: [
            "You can submit a complaint using the contact form on our Contact page, or via the contact details listed there. Please include your account details (if applicable), a clear description of the issue, and any supporting information.",
          ],
        },
        {
          heading: "2. Acknowledgement",
          body: [
            "[Insert verified acknowledgement timeframe, e.g. within X business days of receipt.]",
          ],
        },
        {
          heading: "3. Investigation",
          body: [
            "Complaints are reviewed by [Insert verified responsible team/department]. We aim to investigate complaints thoroughly and fairly.",
          ],
        },
        {
          heading: "4. Resolution Timeframe",
          body: [
            "[Insert verified target timeframe for providing a final response to a complaint.]",
          ],
        },
        {
          heading: "5. Escalation",
          body: [
            "If you are not satisfied with the outcome of your complaint, [Insert verified escalation process, including any applicable external dispute resolution body or regulator, if relevant.]",
          ],
        },
        {
          heading: "6. Record Keeping",
          body: [
            "We maintain records of complaints received and their outcomes in line with applicable regulatory and legal requirements.",
          ],
        },
      ]}
    />
  );
}
