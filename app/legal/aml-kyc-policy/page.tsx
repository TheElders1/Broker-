import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "AML/KYC Policy",
  description: "The anti-money laundering and know-your-customer approach applied by Genesis Pro LTD.",
};

export default function AmlKycPolicyPage() {
  return (
    <LegalPage
      title="AML / KYC Policy"
      intro="Genesis Pro LTD is committed to complying with applicable anti-money laundering (AML) and know-your-customer (KYC) requirements. This policy outlines our general approach."
      sections={[
        {
          heading: "1. Purpose",
          body: [
            "This policy describes how Genesis Pro LTD approaches customer identification, verification, and ongoing monitoring in order to help prevent money laundering, terrorist financing, and other financial crime.",
          ],
        },
        {
          heading: "2. Customer Identification",
          body: [
            "Before an account can be fully activated, clients are required to complete identity verification, which may include providing a valid government-issued identification document and proof of address.",
            "[Insert verified list of accepted identification documents and verification provider once connected.]",
          ],
        },
        {
          heading: "3. Ongoing Monitoring",
          body: [
            "[Insert verified description of ongoing account and transaction monitoring processes.]",
          ],
        },
        {
          heading: "4. Source of Funds",
          body: [
            "We may request information about the source of funds or wealth in certain circumstances, consistent with applicable regulatory requirements.",
          ],
        },
        {
          heading: "5. Record Keeping",
          body: [
            "[Insert verified record retention periods for KYC/AML documentation, consistent with applicable law.]",
          ],
        },
        {
          heading: "6. Reporting Obligations",
          body: [
            "[Insert verified information regarding suspicious activity reporting obligations and the relevant regulatory or financial intelligence authority, if applicable.]",
          ],
        },
        {
          heading: "7. Client Cooperation",
          body: [
            "Clients are required to provide accurate and complete information and to promptly update their details if circumstances change. Failure to provide requested verification information may result in restricted account access.",
          ],
        },
        {
          heading: "8. Regulatory Status",
          body: [
            "[Insert verified regulatory status and applicable AML supervisory authority once confirmed.]",
          ],
        },
      ]}
    />
  );
}
