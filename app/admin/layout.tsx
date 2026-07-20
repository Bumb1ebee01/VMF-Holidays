import type { Metadata } from "next";

// Keep the whole /admin tree — including the public /admin/login page — out of
// search indexes, as belt-and-suspenders alongside the robots.txt disallow. The
// (panel) layout already sets this for the authenticated app; this also covers
// the login page (a client component that can't export its own metadata).
// Pass-through only: it must NOT require auth here, or /admin/login would loop.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminSectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
