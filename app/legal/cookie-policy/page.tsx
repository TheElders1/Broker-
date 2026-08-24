import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Genesis Pro LTD uses cookies and similar technologies on this website.",
  alternates: { canonical: "/legal/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="This Cookie Policy explains how Genesis Pro LTD uses cookies and similar technologies on this website."
      sections={[
        {
          heading: "1. What Are Cookies",
          body: [
            "Cookies are small text files placed on your device when you visit a website. They are widely used to make websites function, or work more efficiently, and to provide information to site owners.",
          ],
        },
        {
          heading: "2. Types of Cookies We Use",
          body: [
            "Essential cookies: required for core website functionality, such as navigation and security.",
            "Preference cookies: remember choices you make to improve your experience.",
            "Analytics cookies: help us understand how visitors use the website. [Insert verified list of analytics tools in use, if any.]",
          ],
        },
        {
          heading: "3. Third-Party Cookies",
          body: [
            "[Insert verified list of any third-party services that set cookies through this website, such as analytics or advertising providers.]",
          ],
        },
        {
          heading: "4. Managing Cookies",
          body: [
            "You can control or delete cookies through your browser settings. Disabling certain cookies may affect the functionality of this website.",
          ],
        },
        {
          heading: "5. Changes to This Policy",
          body: [
            "We may update this Cookie Policy from time to time. Any changes will be posted on this page.",
          ],
        },
        {
          heading: "6. Contact",
          body: ["Questions about this Cookie Policy can be directed to us via our Contact page."],
        },
      ]}
    />
  );
}
