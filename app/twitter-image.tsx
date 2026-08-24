import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/ogFonts";
import { buildOgElement, getMarkDataUri } from "@/lib/ogImage";

export const runtime = "nodejs";
export const alt = "Genesis Pro LTD — Trade With Confidence. Grow With Purpose.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [markSrc, regular, medium, bold] = await Promise.all([
    getMarkDataUri(),
    loadGoogleFont("Inter", 400),
    loadGoogleFont("Inter", 500),
    loadGoogleFont("Inter", 700),
  ]);

  return new ImageResponse(buildOgElement(markSrc), {
    ...size,
    fonts: [
      { name: "Inter", data: regular, weight: 400, style: "normal" },
      { name: "Inter", data: medium, weight: 500, style: "normal" },
      { name: "Inter", data: bold, weight: 700, style: "normal" },
    ],
  });
}
