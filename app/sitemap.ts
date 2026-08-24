import type { MetadataRoute } from "next";

const routes = [
  "",
  "/login",
  "/open-account",
  "/legal/privacy-policy",
  "/legal/terms-conditions",
  "/legal/risk-disclosure",
  "/legal/cookie-policy",
  "/legal/aml-kyc-policy",
  "/legal/complaints-procedure",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://genesispro.example.com";
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
}
