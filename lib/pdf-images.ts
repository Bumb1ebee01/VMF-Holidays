// Shared @react-pdf image helpers. @react-pdf can only embed *baseline* PNG/JPEG
// and cannot fetch during render, so callers pre-fetch and NORMALISE images to a
// baseline JPEG data URI with these. Progressive JPEGs (which several bundled and
// Unsplash assets are) make @react-pdf mis-read the dimensions and render a blank
// cover — sharp re-encodes them to baseline so the hero always draws.

import fs from "fs";
import path from "path";
import sharp from "sharp";

/**
 * Force a Cloudinary URL to a compressed JPEG by injecting a transform after
 * `/image/upload/`. Shrinks the download; sharp still re-encodes afterwards.
 * Non-Cloudinary URLs are returned unchanged.
 */
export function toPdfSafeImageUrl(url: string): string {
  const marker = "/image/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;
  const head = url.slice(0, i + marker.length);
  const tail = url.slice(i + marker.length);
  return `${head}f_jpg,q_auto,w_1400/${tail}`;
}

/**
 * Re-encode any raster (progressive/CMYK JPEG, PNG, WebP, GIF…) to a BASELINE
 * JPEG data URI @react-pdf can always draw. Flattens transparency onto white
 * (JPEG has no alpha) and caps the width. Returns null on failure.
 */
async function toBaselineJpegDataUri(buf: Buffer): Promise<string | null> {
  try {
    const out = await sharp(buf)
      .rotate() // honour EXIF orientation
      .resize({ width: 1400, withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 80, progressive: false, mozjpeg: false })
      .toBuffer();
    return `data:image/jpeg;base64,${out.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Read a bundled/public asset (`/images/...` or `/uploads/...`) off disk. */
async function localImageDataUri(src: string): Promise<string | null> {
  // Same-origin absolute paths only, and never escape the public/ folder.
  if (!src.startsWith("/") || src.includes("..")) return null;
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), "public", src));
    return await toBaselineJpegDataUri(buf);
  } catch {
    return null;
  }
}

/** Best-effort: fetch a remote image and inline it as a baseline JPEG. Never throws. */
async function remoteImageDataUri(url: string): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(toPdfSafeImageUrl(url), { signal: ctrl.signal, cache: "no-store" });
    clearTimeout(t);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 12_000_000) return null; // don't decode absurd payloads
    return await toBaselineJpegDataUri(buf);
  } catch {
    return null;
  }
}

/**
 * Inline any image the CMS might hold — a remote URL (Cloudinary/Unsplash) OR a
 * local `/images/...` / `/uploads/...` path — as a baseline-JPEG data URI. Returns
 * null (never throws) when the source is missing or unreadable, so callers can
 * fall through to the next candidate.
 */
export async function heroDataUri(src: string | null | undefined): Promise<string | null> {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return remoteImageDataUri(src);
  if (src.startsWith("/")) return localImageDataUri(src);
  return null;
}

/**
 * Resolve the itinerary cover hero, guaranteeing an image whenever one can be
 * found. Prefers the shared DESTINATION hero (so every package for a destination
 * carries the same cover photo), then the package image, then the package
 * gallery, then the bundled destination photo on disk keyed by slug. Every new
 * package inherits its destination's hero for free.
 */
export async function resolveItineraryHero(opts: {
  destHero?: string | null;
  pkgHero?: string | null;
  gallery?: string[] | null;
  destSlug?: string | null;
}): Promise<string | null> {
  const candidates: (string | null | undefined)[] = [
    opts.destHero,
    opts.pkgHero,
    ...(opts.gallery ?? []),
    opts.destSlug ? `/images/destinations/${opts.destSlug}.jpg` : null,
  ];
  for (const c of candidates) {
    const uri = await heroDataUri(c);
    if (uri) return uri;
  }
  return null;
}
