import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Reveal from "@/components/Reveal";
import { SITE_URL } from "@/lib/siteUrl";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const TITLE = "Genesis Pro LTD | Online Trading & Global Markets Platform";
const DESCRIPTION =
  "Genesis Pro LTD is a modern financial brokerage offering access to global markets including forex, commodities, indices, stocks and cryptocurrencies through a technology-driven trading platform.";
const SOCIAL_DESCRIPTION =
  "Access global financial markets through a modern trading experience built around transparency, technology, and informed decision-making.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Genesis Pro LTD",
  },
  description: DESCRIPTION,
  applicationName: "Genesis Pro LTD",
  keywords: [
    "Genesis Pro LTD",
    "financial brokerage",
    "online trading",
    "forex trading",
    "global markets",
    "trading platform",
    "commodities trading",
    "cryptocurrency trading",
    "open a trading account",
  ],
  category: "finance",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
    url: "/",
    siteName: "Genesis Pro LTD",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SOCIAL_DESCRIPTION,
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Genesis Pro",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#05070D",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen bg-ink-950 font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-gold-400 focus:px-4 focus:py-2 focus:text-ink-950 focus:font-semibold"
        >
          Skip to main content
        </a>
        {children}
        <Reveal />
      </body>
    </html>
  );
}
