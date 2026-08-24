/**
 * Fetches a Google Fonts weight as raw font data for use with next/og's
 * ImageResponse (Satori only understands raw font buffers, not <link>
 * tags). Used by the opengraph-image / twitter-image routes.
 */
export async function loadGoogleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  )}:wght@${weight}&display=swap`;
  const css = await (await fetch(cssUrl)).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error(`Could not find font source for ${family} ${weight}`);
  const res = await fetch(match[1]);
  if (!res.ok) throw new Error(`Failed to download font for ${family} ${weight}`);
  return res.arrayBuffer();
}
