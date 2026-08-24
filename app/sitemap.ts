import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

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
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
