// Content pages are static but re-render at most every 5 minutes, and
// immediately after admin CMS edits via revalidatePath.
export const revalidate = 300;

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import InstagramFloat from "@/components/ui/InstagramFloat";
import PageLoader from "@/components/ui/PageLoader";
import ScrollRevealInit from "@/components/ui/ScrollRevealInit";
import SmoothScroll from "@/components/ui/SmoothScroll";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SmoothScroll />
      <PageLoader />
      <ScrollRevealInit />
      <Navbar />
      {children}
      <Footer />
      <InstagramFloat />
      <WhatsAppFloat />
    </>
  );
}
