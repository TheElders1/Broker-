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
            "We may collect information you provide directly, such as your name, email address, phone number, and postal address when you open an account or contact us.",
            "We may also collect technical information such as browser type, device information, and usage data through standard web technologies. This site does not currently use analytics or tracking tools beyond what's strictly necessary for it to function.",
          ],
        },
        {
          heading: "2. How We Use Information",
          body: [
            "Information we collect is used to operate our services, administer your account, communicate with you, provide customer support, comply with legal and regulatory obligations, and protect against fraud.",
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
            "We do not sell personal information. We share information with service providers who help us operate our platform under appropriate confidentiality and security obligations — currently Supabase, which provides our account authentication and database infrastructure. This list will be updated as additional providers (such as payment processing) are connected.",
          ],
        },
        {
          heading: "5. Data Retention",
          body: [
            "We retain account information for as long as your account remains active, plus any additional period required by applicable financial recordkeeping obligations once those are confirmed for your jurisdiction.",
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
            "Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict the use of your personal information. To exercise any of these rights, contact us using the details on our Contact page and we will respond within a reasonable timeframe.",
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
            "For questions about this Privacy Policy, contact us at genesisproltd@gmail.com or using the details on our Contact page.",
          ],
        },
      ]}
    />
  );
}
