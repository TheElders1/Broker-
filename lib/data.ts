export type NavLink = { label: string; href: string };

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Markets", href: "/#markets" },
  { label: "Trading", href: "/#trading" },
  { label: "Why Genesis Pro", href: "/#why-genesis-pro" },
  { label: "Education", href: "/education" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_NAV: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Markets", href: "/#markets" },
  { label: "Trading", href: "/#trading" },
  { label: "Education", href: "/education" },
  { label: "Risk Management", href: "/risk-management" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const LEGAL_LINKS: NavLink[] = [
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "Terms & Conditions", href: "/legal/terms-conditions" },
  { label: "Risk Disclosure", href: "/legal/risk-disclosure" },
  { label: "Cookie Policy", href: "/legal/cookie-policy" },
  { label: "AML/KYC Policy", href: "/legal/aml-kyc-policy" },
  { label: "Complaints Procedure", href: "/legal/complaints-procedure" },
];

export const TRUST_STATS = [
  {
    title: "Global Markets",
    description:
      "Access a broad range of asset classes from a single, unified trading account.",
    icon: "globe",
  },
  {
    title: "Advanced Trading",
    description:
      "Modern charting, order types, and analysis tools built for informed decision-making.",
    icon: "chart",
  },
  {
    title: "Dedicated Support",
    description:
      "A support team available to help you with account and platform questions.",
    icon: "headset",
  },
  {
    title: "Secure Platform",
    description:
      "Account access protected by modern security practices and encrypted infrastructure.",
    icon: "shield",
  },
];

export const ABOUT_FEATURES = [
  {
    title: "Transparency",
    description:
      "Clear information about how our platform, accounts, and processes work — no hidden surprises.",
    icon: "eye",
  },
  {
    title: "Technology",
    description:
      "A modern trading environment built on reliable, scalable technology designed for a smooth experience.",
    icon: "cpu",
  },
  {
    title: "Client Support",
    description:
      "Responsive assistance to help you navigate your account, tools, and platform features.",
    icon: "users",
  },
];

export const MARKETS = [
  {
    title: "Forex",
    description:
      "Trade major, minor, and exotic currency pairs across global foreign exchange markets.",
    icon: "forex",
  },
  {
    title: "Commodities",
    description:
      "Gain exposure to precious metals, energy, and agricultural commodities.",
    icon: "commodities",
  },
  {
    title: "Indices",
    description:
      "Access major global stock indices representing broad market performance.",
    icon: "indices",
  },
  {
    title: "Stocks",
    description:
      "Trade shares of well-known publicly listed companies from global exchanges.",
    icon: "stocks",
  },
  {
    title: "Cryptocurrencies",
    description:
      "Explore price movements of leading digital assets alongside traditional markets.",
    icon: "crypto",
  },
  {
    title: "Other Instruments",
    description:
      "Additional instruments may be available depending on account type and region.",
    icon: "instruments",
  },
];

export const WHY_GENESIS_PRO = [
  {
    title: "Modern Trading Technology",
    description:
      "A platform built with contemporary infrastructure designed for stability and responsiveness.",
    icon: "bolt",
  },
  {
    title: "Market Access",
    description:
      "A single account experience giving you access to a range of global instruments.",
    icon: "network",
  },
  {
    title: "User-Friendly Experience",
    description:
      "An interface designed to be approachable for newer traders while staying powerful for experienced ones.",
    icon: "layout",
  },
  {
    title: "Risk Management Tools",
    description:
      "Order types and account features designed to help you manage exposure and risk.",
    icon: "shield-check",
  },
  {
    title: "Educational Resources",
    description:
      "Guides and materials to help you build your understanding of markets and trading concepts.",
    icon: "book",
  },
  {
    title: "Customer Support",
    description:
      "A support team ready to help with account, platform, and general enquiries.",
    icon: "life-buoy",
  },
];

export type AccountType = {
  name: string;
  tagline: string;
  featured?: boolean;
  fields: { label: string; value: string }[];
};

export const ACCOUNT_TYPES: AccountType[] = [
  {
    name: "Basic",
    tagline: "For traders getting started",
    fields: [
      { label: "Minimum Deposit", value: "[Insert verified minimum deposit]" },
      { label: "Spreads", value: "[Insert verified spread information]" },
      { label: "Commission", value: "[Insert verified commission structure]" },
      { label: "Leverage", value: "[Insert verified leverage terms]" },
      { label: "Instruments", value: "[Insert verified instrument list]" },
      { label: "Support Level", value: "Standard support" },
    ],
  },
  {
    name: "Professional",
    tagline: "For active, experienced traders",
    featured: true,
    fields: [
      { label: "Minimum Deposit", value: "[Insert verified minimum deposit]" },
      { label: "Spreads", value: "[Insert verified spread information]" },
      { label: "Commission", value: "[Insert verified commission structure]" },
      { label: "Leverage", value: "[Insert verified leverage terms]" },
      { label: "Instruments", value: "[Insert verified instrument list]" },
      { label: "Support Level", value: "Priority support" },
    ],
  },
  {
    name: "Premium",
    tagline: "For high-volume traders",
    fields: [
      { label: "Minimum Deposit", value: "[Insert verified minimum deposit]" },
      { label: "Spreads", value: "[Insert verified spread information]" },
      { label: "Commission", value: "[Insert verified commission structure]" },
      { label: "Leverage", value: "[Insert verified leverage terms]" },
      { label: "Instruments", value: "[Insert verified instrument list]" },
      { label: "Support Level", value: "Dedicated account support" },
    ],
  },
];

export const EDUCATION_TOPICS = [
  {
    title: "Beginner's Guide to Trading",
    description:
      "Start with the fundamentals — key terminology, how markets work, and how to place your first trade.",
    icon: "compass",
  },
  {
    title: "Forex Fundamentals",
    description:
      "Understand currency pairs, pips, and the forces that move foreign exchange markets.",
    icon: "currency",
  },
  {
    title: "Technical Analysis",
    description:
      "Learn how traders use charts, patterns, and indicators to study price behaviour.",
    icon: "trending",
  },
  {
    title: "Risk Management",
    description:
      "Explore concepts like stop-loss orders, position sizing, and protecting your capital.",
    icon: "shield-check",
  },
  {
    title: "Market Psychology",
    description:
      "Understand the emotional and behavioural factors that influence trading decisions.",
    icon: "brain",
  },
  {
    title: "Trading Strategies",
    description:
      "An overview of common strategic approaches traders use to plan their market activity.",
    icon: "strategy",
  },
];

export const RISK_TOPICS = [
  {
    title: "Stop-Loss Orders",
    description:
      "A stop-loss is an instruction to close a position at a predetermined price to help limit potential losses.",
  },
  {
    title: "Position Sizing",
    description:
      "Determining how much capital to allocate to a single trade relative to your overall account.",
  },
  {
    title: "Risk/Reward Concepts",
    description:
      "Evaluating the potential downside of a trade against its potential upside before entering a position.",
  },
  {
    title: "Diversification",
    description:
      "Spreading exposure across different instruments or asset classes rather than concentrating risk.",
  },
  {
    title: "Understanding Leverage",
    description:
      "Leverage can magnify both gains and losses. It should only be used once its mechanics are fully understood.",
  },
  {
    title: "Emotional Discipline",
    description:
      "Maintaining a consistent, rules-based approach and avoiding decisions driven by fear or excitement.",
  },
];

export const FAQS = [
  {
    question: "What is Genesis Pro LTD?",
    answer:
      "Genesis Pro LTD is a financial brokerage that provides a technology-driven platform for accessing global financial markets. [Insert verified company description and registration details.]",
  },
  {
    question: "How do I open an account?",
    answer:
      "You can begin the account opening process using the \"Open Account\" button, which will guide you through personal information, contact details, account preferences, and identity verification.",
  },
  {
    question: "What markets are available?",
    answer:
      "Depending on your account type and region, you may be able to access markets such as forex, commodities, indices, stocks, and cryptocurrencies. [Insert verified list of available instruments.]",
  },
  {
    question: "What trading platform do you use?",
    answer:
      "[Insert verified trading platform name and details once confirmed.]",
  },
  {
    question: "What are the fees?",
    answer:
      "Fees vary by account type. [Insert verified spreads, commissions, and any additional fees.]",
  },
  {
    question: "What is the minimum deposit?",
    answer: "[Insert verified minimum deposit amount per account type.]",
  },
  {
    question: "How do I deposit funds?",
    answer:
      "[Insert verified deposit methods and processing information once a payment provider is connected.]",
  },
  {
    question: "How do I withdraw funds?",
    answer:
      "[Insert verified withdrawal process, methods, and processing times once a withdrawal system is connected.]",
  },
  {
    question: "Is trading risky?",
    answer:
      "Yes. Trading financial instruments involves significant risk and may not be suitable for all investors. You may lose some or all of your invested capital. Please review our Risk Disclosure before trading.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach our team using the contact form on this page, or via the details listed in the Contact section. [Insert verified support email and phone number.]",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "This space is reserved for a verified client testimonial. Replace with real, consented feedback once available.",
    name: "Sample Testimonial",
    role: "Placeholder",
  },
  {
    quote:
      "This space is reserved for a verified client testimonial. Replace with real, consented feedback once available.",
    name: "Sample Testimonial",
    role: "Placeholder",
  },
  {
    quote:
      "This space is reserved for a verified client testimonial. Replace with real, consented feedback once available.",
    name: "Sample Testimonial",
    role: "Placeholder",
  },
];

export const RISK_DISCLAIMER =
  "Trading financial markets involves risk. Past performance does not guarantee future results.";

export const FOOTER_RISK_WARNING =
  "Trading financial instruments involves significant risk and may not be suitable for all investors. You may lose some or all of your invested capital.";

export const CONTACT_PLACEHOLDERS = {
  email: "[Insert verified company email]",
  phone: "[Insert verified phone number]",
  address: "[Insert verified business address]",
  hours: "[Insert verified business hours]",
};

// Social links intentionally left empty. Only add an entry here once an
// account genuinely exists — do not populate with placeholder profiles.
export const SOCIAL_LINKS: { label: string; href: string }[] = [];
