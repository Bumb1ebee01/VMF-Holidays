// Shared @react-pdf image helpers. @react-pdf can only embed PNG/JPEG and cannot
// fetch during render, so callers pre-fetch images to data URIs with these.
// (Mirrors the inline copies in app/api/itinerary/[slug]/route.ts.)

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

/** Best-effort: fetch a remote image and inline it as a data URI. Never throws. */
export async function heroDataUri(url: string | null | undefined): Promise<string | null> {
  if (!url || !/^https?:\/\//i.test(url)) return null;
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
