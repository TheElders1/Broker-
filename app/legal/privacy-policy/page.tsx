import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Genesis Pro LTD collects, uses, and protects personal information.",
  alternates: { canonical: "/legal/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This Privacy Policy explains how Genesis Pro LTD ('we', 'us', 'our') collects, uses, discloses, and safeguards information in connection with this website and our services."
      sections={[
        {
          heading: "1. Information We Collect",
          body: [
            "We may collect information you provide directly, such as your name, email address, phone number, postal address, and identity verification documents when you open an account or contact us.",
            "We may also collect technical information such as browser type, device information, and usage data through standard web technologies. [Insert verified details of analytics or tracking tools in use, if any.]",
          ],
        },
        {
          heading: "2. How We Use Information",
          body: [
            "Information we collect may be used to operate and improve our services, process account applications, communicate with you, comply with legal and regulatory obligations, and protect against fraud.",
            "[Insert verified list of specific processing purposes once finalized.]",
          ],
        },
        {
          heading: "3. Legal Basis for Processing",
          body: [
            "[Insert verified legal basis for processing personal data applicable to your jurisdiction, e.g. consent, contract, legal obligation, or legitimate interest.]",
          ],
        },
        {
          heading: "4. Sharing of Information",
          body: [
            "We do not sell personal information. We may share information with service providers who help us operate our platform (for example, identity verification, payment processing, or customer support providers) under appropriate confidentiality obligations.",
            "[Insert verified list of third-party processors once contracted.]",
          ],
        },
        {
          heading: "5. Data Retention",
          body: [
            "[Insert verified data retention periods, which may be influenced by applicable financial recordkeeping and AML/KYC regulations.]",
          ],
        },
        {
          heading: "6. Data Security",
          body: [
            "We aim to apply reasonable technical and organizational measures to protect information from unauthorized access, alteration, disclosure, or destruction. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
          ],
        },
        {
          heading: "7. Your Rights",
          body: [
            "Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict the use of your personal information. [Insert verified process for exercising data subject rights.]",
          ],
        },
        {
          heading: "8. Cookies",
          body: [
            "This website may use cookies and similar technologies. See our Cookie Policy for further detail.",
          ],
        },
        {
          heading: "9. International Transfers",
          body: [
            "[Insert verified information about any international transfer of personal data and applicable safeguards.]",
          ],
        },
        {
          heading: "10. Contact Us",
          body: [
            "For questions about this Privacy Policy, contact us using the details on our Contact page. [Insert verified data protection contact / officer details.]",
          ],
        },
      ]}
    />
  );
}
