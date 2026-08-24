import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Risk Disclosure",
  description: "Important information about the risks involved in trading financial instruments.",
};

export default function RiskDisclosurePage() {
  return (
    <LegalPage
      title="Risk Disclosure"
      intro="Trading financial instruments involves significant risk and may not be suitable for all investors. Please read this Risk Disclosure carefully before using any trading services."
      sections={[
        {
          heading: "1. General Risk Warning",
          body: [
            "The value of financial instruments can fluctuate and you may lose some or all of your invested capital. Past performance is not a reliable indicator of future results. You should not trade with money you cannot afford to lose.",
          ],
        },
        {
          heading: "2. Leverage Risk",
          body: [
            "Where leverage is available, it can magnify both gains and losses. A relatively small market movement can have a proportionally larger effect on funds deposited. [Insert verified leverage terms and applicable limits.]",
          ],
        },
        {
          heading: "3. Market Risk",
          body: [
            "Prices of currencies, commodities, indices, stocks, and cryptocurrencies can be volatile and are influenced by factors including economic data, geopolitical events, and market sentiment, which may be unpredictable.",
          ],
        },
        {
          heading: "4. Liquidity Risk",
          body: [
            "Under certain market conditions, it may be difficult or impossible to execute an order at a desired price, or at all.",
          ],
        },
        {
          heading: "5. Cryptocurrency-Specific Risk",
          body: [
            "Cryptocurrencies can be highly volatile, are subject to unique technological and regulatory risks, and may not be suitable for all investors.",
          ],
        },
        {
          heading: "6. No Guaranteed Returns",
          body: [
            "Genesis Pro LTD does not guarantee any profit, return, or trading outcome. No representation is made that any account will or is likely to achieve profits or losses similar to any example shown.",
          ],
        },
        {
          heading: "7. Technology Risk",
          body: [
            "Trading platforms and connectivity can be subject to disruption, delay, or failure, which may affect your ability to trade or manage positions.",
          ],
        },
        {
          heading: "8. Your Responsibility",
          body: [
            "You are responsible for understanding the instruments you trade and for evaluating whether trading is appropriate for your financial situation. Consider seeking independent financial advice if you are uncertain.",
          ],
        },
        {
          heading: "9. Regulatory Status",
          body: [
            "[Insert verified regulatory status, license numbers, and regulator details once confirmed. Do not rely on this website for regulatory information until this section is completed.]",
          ],
        },
      ]}
    />
  );
}
