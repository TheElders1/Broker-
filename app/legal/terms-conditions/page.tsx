import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms and conditions governing use of the Genesis Pro LTD website and services.",
  alternates: { canonical: "/legal/terms-conditions" },
};

export default function TermsConditionsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="These Terms & Conditions ('Terms') govern your access to and use of the Genesis Pro LTD website and services. By using this website or opening an account, you agree to these Terms."
      sections={[
        {
          heading: "1. About Genesis Pro LTD",
          body: [
            "Genesis Pro LTD provides a technology-driven platform intended to give clients access to information about, and tools related to, global financial markets. [Insert verified company registration number, registered office, and regulatory status.]",
          ],
        },
        {
          heading: "2. Eligibility",
          body: [
            "You must be at least 18 years old and have the legal capacity to enter into a binding agreement to open an account. Client eligibility is subject to applicable laws, regulations, and Genesis Pro LTD's internal compliance requirements. The final list of restricted jurisdictions will be published after legal review.",
          ],
        },
        {
          heading: "3. Account Registration",
          body: [
            "You agree to provide accurate and complete information during registration and to keep your account information up to date. You are responsible for maintaining the confidentiality of your account credentials.",
          ],
        },
        {
          heading: "4. Nature of Services",
          body: [
            "Any trading platform, market data, or dashboard shown on this website that is described as demo or illustrative does not represent real trading activity, real funds, or guaranteed outcomes unless explicitly stated otherwise and connected to a live, verified system.",
          ],
        },
        {
          heading: "5. No Investment Advice",
          body: [
            "Content on this website is provided for general informational and educational purposes only and does not constitute investment, financial, legal, or tax advice. You should seek independent professional advice before making trading decisions.",
          ],
        },
        {
          heading: "6. Risk Acknowledgment",
          body: [
            "Trading financial instruments involves significant risk and may result in the loss of some or all invested capital. Please review our Risk Disclosure before trading.",
          ],
        },
        {
          heading: "7. Fees and Charges",
          body: [
            "Spreads, commission, and minimum deposit vary by account type — see Account Types for current figures. Figures shown there are representative and subject to confirmation before your account is opened.",
          ],
        },
        {
          heading: "8. Prohibited Use",
          body: [
            "You agree not to misuse the website or services, including through unauthorized access, fraudulent activity, or violation of applicable law.",
          ],
        },
        {
          heading: "9. Intellectual Property",
          body: [
            "All content, trademarks, and materials on this website, including the Genesis Pro LTD name and logo, are the property of Genesis Pro LTD or its licensors and may not be used without permission.",
          ],
        },
        {
          heading: "10. Limitation of Liability",
          body: [
            "To the fullest extent permitted by law, Genesis Pro LTD shall not be liable for indirect, incidental, special, or consequential damages, or any loss of profits or trading losses, arising from your use of this website or its services. Nothing in these Terms limits liability that cannot lawfully be excluded under the law applicable to your jurisdiction.",
          ],
        },
        {
          heading: "11. Amendments",
          body: [
            "We may update these Terms from time to time. Continued use of the website after changes constitutes acceptance of the revised Terms.",
          ],
        },
        {
          heading: "12. Governing Law",
          body: ["[Insert verified governing law and jurisdiction.]"],
        },
        {
          heading: "13. Contact",
          body: ["Questions about these Terms can be directed to us via our Contact page."],
        },
      ]}
    />
  );
}
