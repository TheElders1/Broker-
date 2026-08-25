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
            "We aim to acknowledge receipt of your complaint within 2 business days.",
          ],
        },
        {
          heading: "3. Investigation",
          body: [
            "Complaints are reviewed by our customer support team, escalated to a supervisor where warranted. We aim to investigate complaints thoroughly and fairly.",
          ],
        },
        {
          heading: "4. Resolution Timeframe",
          body: [
            "We aim to provide a final response within 15 business days of acknowledging your complaint. Where a complaint requires more time, we will let you know and provide an updated timeframe.",
          ],
        },
        {
          heading: "5. Escalation",
          body: [
            "If you are not satisfied with the outcome of your complaint, you may request that it be reviewed by senior management. [Insert verified external dispute resolution body or regulator, if applicable to your jurisdiction.]",
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
