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
      { label: "Minimum Deposit", value: "$250" },
      { label: "Spreads", value: "From 1.6 pips" },
      { label: "Commission", value: "Commission-free" },
      { label: "Leverage", value: "Up to 1:30" },
      { label: "Instruments", value: "Forex, Commodities, Indices" },
      { label: "Support Level", value: "Standard support" },
    ],
  },
  {
    name: "Professional",
    tagline: "For active, experienced traders",
    featured: true,
    fields: [
      { label: "Minimum Deposit", value: "$2,500" },
      { label: "Spreads", value: "From 0.8 pips" },
      { label: "Commission", value: "$5 per lot" },
      { label: "Leverage", value: "Up to 1:100" },
      { label: "Instruments", value: "Forex, Commodities, Indices, Stocks, Cryptocurrencies" },
      { label: "Support Level", value: "Priority support" },
    ],
  },
  {
    name: "Premium",
    tagline: "For high-volume traders",
    fields: [
      { label: "Minimum Deposit", value: "$10,000" },
      { label: "Spreads", value: "From 0.2 pips" },
      { label: "Commission", value: "$3 per lot" },
      { label: "Leverage", value: "Up to 1:200" },
      { label: "Instruments", value: "Forex, Commodities, Indices, Stocks, Cryptocurrencies" },
      { label: "Support Level", value: "Dedicated account support" },
    ],
  },
];

export const EDUCATION_TOPICS = [
  {
    slug: "beginners-guide-to-trading",
    title: "Beginner's Guide to Trading",
    description:
      "Start with the fundamentals — key terminology, how markets work, and how to place your first trade.",
    icon: "compass",
  },
  {
    slug: "forex-fundamentals",
    title: "Forex Fundamentals",
    description:
      "Understand currency pairs, pips, and the forces that move foreign exchange markets.",
    icon: "currency",
  },
  {
    slug: "technical-analysis",
    title: "Technical Analysis",
    description:
      "Learn how traders use charts, patterns, and indicators to study price behaviour.",
    icon: "trending",
  },
  {
    slug: "risk-management",
    title: "Risk Management",
    description:
      "Explore concepts like stop-loss orders, position sizing, and protecting your capital.",
    icon: "shield-check",
  },
  {
    slug: "market-psychology",
    title: "Market Psychology",
    description:
      "Understand the emotional and behavioural factors that influence trading decisions.",
    icon: "brain",
  },
  {
    slug: "trading-strategies",
    title: "Trading Strategies",
    description:
      "An overview of common strategic approaches traders use to plan their market activity.",
    icon: "strategy",
  },
];

export const EDUCATION_ARTICLES: Record<
  string,
  { intro: string; sections: { heading: string; body: string[] }[] }
> = {
  "beginners-guide-to-trading": {
    intro:
      "A starting point for understanding what trading involves before you place your first order.",
    sections: [
      {
        heading: "What Trading Means",
        body: [
          "Trading is the practice of buying and selling financial instruments — currencies, commodities, indices, stocks, or cryptocurrencies — with the aim of profiting from changes in their price. Every trade has two sides: the price you enter at, and the price you exit at.",
        ],
      },
      {
        heading: "Key Terms Worth Knowing",
        body: [
          "A 'position' is an open trade. 'Long' means you profit if the price rises; 'short' means you profit if it falls. 'Spread' is the small difference between the buy and sell price. 'Leverage' lets you control a larger position than your account balance alone would allow — it magnifies both gains and losses.",
        ],
      },
      {
        heading: "Placing a First Trade",
        body: [
          "Most platforms follow the same basic steps: choose an instrument, decide on a direction (buy or sell), set a size, and optionally attach a stop-loss and take-profit level before confirming. Practising on a demo account before using real funds is a common way to get comfortable with the process.",
        ],
      },
      {
        heading: "Before You Start",
        body: [
          "Trading involves risk of loss, and no outcome is guaranteed. New traders benefit from starting small, understanding the instruments they trade, and reading the Risk Disclosure in full before committing real capital.",
        ],
      },
    ],
  },
  "forex-fundamentals": {
    intro: "The basics of how the foreign exchange (forex) market works.",
    sections: [
      {
        heading: "Currency Pairs",
        body: [
          "Forex is always traded in pairs, such as EUR/USD, because you're simultaneously buying one currency and selling another. The first currency listed is the 'base' currency; the second is the 'quote' currency. The price tells you how much of the quote currency it takes to buy one unit of the base currency.",
        ],
      },
      {
        heading: "Pips and Price Movement",
        body: [
          "A 'pip' is the smallest standard price movement for a currency pair — typically the fourth decimal place (e.g., 1.0842 to 1.0843 is one pip). Pip movements are used to measure gains, losses, and spreads across the market.",
        ],
      },
      {
        heading: "What Moves Currency Markets",
        body: [
          "Exchange rates are influenced by interest rate decisions, inflation data, employment figures, political events, and overall market sentiment. Because so many factors interact at once, currency prices can move quickly and are not fully predictable.",
        ],
      },
      {
        heading: "Market Hours",
        body: [
          "Forex trades nearly continuously across global sessions — Sydney, Tokyo, London, and New York — from Sunday evening through Friday evening (in most time zones), since as one financial centre closes, another opens.",
        ],
      },
    ],
  },
  "technical-analysis": {
    intro: "An introduction to studying price charts to inform trading decisions.",
    sections: [
      {
        heading: "The Core Idea",
        body: [
          "Technical analysis is the study of historical price and volume data — usually via charts — on the assumption that price patterns can offer insight into potential future behaviour. It's distinct from fundamental analysis, which looks at underlying economic or company data.",
        ],
      },
      {
        heading: "Chart Types",
        body: [
          "Candlestick charts are the most common format: each 'candle' shows the open, high, low, and close price for a given time period, and its colour indicates whether price rose or fell over that period.",
        ],
      },
      {
        heading: "Common Indicators",
        body: [
          "Moving averages smooth out price data to show the general trend direction. RSI (Relative Strength Index) measures the speed of recent price changes to gauge whether an instrument may be overbought or oversold. MACD compares two moving averages to highlight potential shifts in momentum. Bollinger Bands measure volatility relative to a moving average.",
        ],
      },
      {
        heading: "A Tool, Not a Guarantee",
        body: [
          "No indicator or pattern reliably predicts future price movement. Technical analysis is one input among many that traders use to inform decisions — it does not eliminate the risk of loss.",
        ],
      },
    ],
  },
  "risk-management": {
    intro: "Core concepts for managing risk when trading financial markets.",
    sections: [
      {
        heading: "Why Risk Management Matters",
        body: [
          "Even a sound trading idea can lose money if position sizes are too large or losses aren't controlled. Risk management is about protecting your capital so that no single trade — or string of trades — can cause disproportionate damage to your account.",
        ],
      },
      {
        heading: "Stop-Loss Orders",
        body: [
          "A stop-loss is an instruction to automatically close a position once it reaches a predetermined, less favourable price, capping potential loss on that trade. It doesn't guarantee execution at the exact level specified, particularly in fast-moving markets.",
        ],
      },
      {
        heading: "Position Sizing",
        body: [
          "Position sizing is deciding how much capital to risk on a single trade relative to your total account. Many traders risk only a small percentage of their account on any one position, so that a series of losses doesn't erode the account significantly.",
        ],
      },
      {
        heading: "Diversification and Leverage Awareness",
        body: [
          "Spreading exposure across different instruments, rather than concentrating risk in one, is a common way to reduce the impact of any single adverse move. Where leverage is used, it's worth remembering it magnifies losses just as much as gains — understand the mechanics fully before using it.",
        ],
      },
    ],
  },
  "market-psychology": {
    intro: "How emotions and behaviour influence trading decisions — and how to manage them.",
    sections: [
      {
        heading: "Fear and Greed",
        body: [
          "Two emotions are frequently cited as driving poor trading decisions: fear (closing a position too early, or avoiding a valid opportunity) and greed (holding a position too long, or taking on excessive risk chasing a bigger gain).",
        ],
      },
      {
        heading: "Common Behavioural Patterns",
        body: [
          "Traders often describe 'revenge trading' — increasing risk to quickly recover a previous loss — as a particularly damaging habit. Overconfidence after a winning streak, and hesitation after a losing one, are also widely discussed patterns worth watching for in your own behaviour.",
        ],
      },
      {
        heading: "Building Discipline",
        body: [
          "Having a plan before entering a trade — including your reason for entering, your stop-loss level, and your target — and sticking to it regardless of how the market moves in between, is one way traders try to reduce emotionally-driven decisions.",
        ],
      },
      {
        heading: "Keeping Perspective",
        body: [
          "No single trade defines a trading approach. Reviewing decisions objectively over time, rather than reacting to any one outcome, is a habit many experienced traders describe as valuable — though it does not remove the underlying risk of loss.",
        ],
      },
    ],
  },
  "trading-strategies": {
    intro: "A general overview of strategic approaches traders use — not a recommendation of any one.",
    sections: [
      {
        heading: "Day Trading",
        body: [
          "Day trading involves opening and closing positions within the same trading day, aiming to profit from short-term price movements without holding positions overnight.",
        ],
      },
      {
        heading: "Swing Trading",
        body: [
          "Swing trading involves holding positions for several days to weeks, aiming to capture a larger price move than intraday trading, while accepting the risk of overnight and weekend price gaps.",
        ],
      },
      {
        heading: "Position Trading",
        body: [
          "Position trading takes a longer-term view, often holding for weeks or months based on broader trends, and typically places less emphasis on short-term price fluctuations.",
        ],
      },
      {
        heading: "Choosing an Approach",
        body: [
          "The right approach depends on factors like the time you can dedicate, your risk tolerance, and your familiarity with the instruments involved. Whatever the approach, it carries risk of loss and should be paired with sound risk management.",
        ],
      },
    ],
  },
};

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
      "Genesis Pro LTD is a financial brokerage that provides a technology-driven platform for accessing global financial markets, built around transparency, modern tooling, and direct client support. [Company registration number, registered office, and regulatory status: pending verification.]",
  },
  {
    question: "How do I open an account?",
    answer:
      "You can begin the account opening process using the \"Open Account\" button, which will guide you through your personal information, contact details, and account preferences.",
  },
  {
    question: "What markets are available?",
    answer:
      "Depending on your account type and region, you can access forex, commodities, indices, stocks, and cryptocurrencies. See the Markets section for the full list of instrument categories.",
  },
  {
    question: "What trading platform do you use?",
    answer:
      "Genesis Pro LTD's own web-based trading platform, accessible directly from your account dashboard — no separate download required.",
  },
  {
    question: "What are the fees?",
    answer:
      "Fees vary by account type — spreads, commission, and minimum deposit are listed under Account Types. Figures shown there are representative and pending final confirmation.",
  },
  {
    question: "What is the minimum deposit?",
    answer: "Minimum deposit varies by account type, from $250 on a Basic account. See Account Types for the full breakdown.",
  },
  {
    question: "How do I deposit funds?",
    answer:
      "Deposits are currently supported via Bitcoin and USDT from your dashboard's Deposits page. Additional payment methods will be added as providers are connected.",
  },
  {
    question: "How do I withdraw funds?",
    answer:
      "Withdrawals are currently supported via Bitcoin and USDT from your dashboard's Withdrawals page. Processing times depend on network confirmations.",
  },
  {
    question: "Is trading risky?",
    answer:
      "Yes. Trading financial instruments involves significant risk and may not be suitable for all investors. You may lose some or all of your invested capital. Please review our Risk Disclosure before trading.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach our team using the contact form on this page, or via the details listed in the Contact section.",
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

export const CONTACT_DETAILS = {
  email: "genesisproltd@gmail.com",
  phone: "+1 (631) 555-0148",
  address: "4145 Middle Country Road, Calverton, NY 11933",
  hours: "24/5 — Sunday 5:00 PM to Friday 5:00 PM ET, following global market hours",
};

// Social links intentionally left empty. Only add an entry here once an
// account genuinely exists — do not populate with placeholder profiles.
export const SOCIAL_LINKS: { label: string; href: string }[] = [];
