import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Reveal from "@/components/Reveal";

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

const siteUrl = "https://genesispro.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Genesis Pro LTD | Online Trading & Global Markets Platform",
    template: "%s | Genesis Pro LTD",
  },
  description:
    "Genesis Pro LTD is a modern financial brokerage offering access to global markets including forex, commodities, indices, stocks and cryptocurrencies through a technology-driven trading platform.",
  keywords: [
    "Genesis Pro LTD",
    "financial brokerage",
    "online trading",
    "forex trading",
    "global markets",
    "trading platform",
  ],
  openGraph: {
    title: "Genesis Pro LTD | Online Trading & Global Markets Platform",
    description:
      "Access global financial markets through a modern trading experience built around transparency, technology, and informed decision-making.",
    url: siteUrl,
    siteName: "Genesis Pro LTD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Genesis Pro LTD | Online Trading & Global Markets Platform",
    description:
      "A modern financial brokerage offering access to global markets through a technology-driven trading platform.",
  },
  icons: {
    icon: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
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
