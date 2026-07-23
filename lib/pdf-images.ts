// Shared @react-pdf image helpers. @react-pdf can only embed PNG/JPEG and cannot
// fetch during render, so callers pre-fetch images to data URIs with these.

import fs from "fs";
import path from "path";

/**
 * Force a Cloudinary URL to a PDF-safe, compressed JPEG by injecting a transform
 * after `/image/upload/`. Non-Cloudinary URLs are returned unchanged.
 */
export function toPdfSafeImageUrl(url: string): string {
  const marker = "/image/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;
  const head = url.slice(0, i + marker.length);
  const tail = url.slice(i + marker.length);
  return `${head}f_jpg,q_auto,w_1200/${tail}`;
}

/** Read a bundled/public asset (a `/images/...` or `/uploads/...` path) from disk. */
function localImageDataUri(src: string): string | null {
  // Only same-origin absolute paths, and never escape the public/ folder.
  if (!src.startsWith("/") || src.includes("..")) return null;
  const ext = path.extname(src).toLowerCase();
  const mime = ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : null;
  // @react-pdf can only draw PNG/JPEG — webp/gif/svg would render blank.
  if (!mime) return null;
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), "public", src));
    if (buf.length > 3_000_000) return null;
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Best-effort: fetch a remote image and inline it as a data URI. Never throws. */
async function remoteImageDataUri(url: string): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(toPdfSafeImageUrl(url), { signal: ctrl.signal, cache: "no-store" });
    clearTimeout(t);
    if (!res.ok) return null;
    const type = res.headers.get("content-type") || "image/jpeg";
    // Never embed a format @react-pdf can't draw (gif/webp/etc.) — it renders blank.
    if (!/^image\/(jpeg|jpg|png)$/i.test(type)) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 3_000_000) return null; // don't inline huge images
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Inline any image the CMS might hold — a remote URL (Cloudinary/Unsplash) OR a
 * local `/images/...` or `/uploads/...` path — as a PDF-safe data URI. Returns
 * null (never throws) when the source is missing or a format @react-pdf can't
 * draw, so callers can fall through to the next candidate.
 *
 * Local paths matter: several destinations store `/images/destinations/x.jpg`
 * rather than a remote URL, and those must still produce a cover image.
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
