// Content pages are static but re-render at most every 5 minutes, and
// immediately after admin CMS edits via revalidatePath.
export const revalidate = 300;

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import PageLoader from "@/components/ui/PageLoader";
import ScrollRevealInit from "@/components/ui/ScrollRevealInit";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PageLoader />
      <ScrollRevealInit />
      <Navbar />
      {children}
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
