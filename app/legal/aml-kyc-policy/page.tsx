import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "AML/KYC Policy",
  description: "The anti-money laundering and know-your-customer approach applied by Genesis Pro LTD.",
  alternates: { canonical: "/legal/aml-kyc-policy" },
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
            "Identity verification is not currently required to open an account. As formal verification procedures are put in place, this section will be updated with the accepted documents and process before verification is required of any client.",
          ],
        },
        {
          heading: "3. Ongoing Monitoring",
          body: [
            "Automated ongoing account and transaction monitoring is not yet in place. This section will describe that process once it is implemented.",
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
            "Records will be retained for the period required by applicable law and regulatory requirements.",
          ],
        },
        {
          heading: "6. Reporting Obligations",
          body: [
            "Where required, suspicious activity will be reported to the relevant financial intelligence authority. The specific reporting authority applicable to Genesis Pro LTD is to be provided after legal/regulatory review.",
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
            "[Insert verified regulatory status once confirmed.] The applicable AML supervisory authority is to be provided after legal/regulatory review.",
          ],
        },
      ]}
    />
  );
}
