/**
 * Public site URL used for metadata, canonical links, robots.txt, and
 * sitemap.xml. Set NEXT_PUBLIC_SITE_URL in the hosting environment (e.g.
 * Render's dashboard) to the real deployed URL — a Render *.onrender.com
 * URL or a custom domain once one is attached. Falls back to a clearly
 * fake placeholder so nothing accidentally points at a real third party
 * domain before this is configured.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "https://genesispro.example.com";
