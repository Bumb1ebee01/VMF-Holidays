import Script from "next/script";

// Google Analytics 4 — loads only when NEXT_PUBLIC_GA_ID is set, so the site
// ships analytics-ready but stays inert (and cookie-free) until you add the
// measurement ID in the environment. The CSP in next.config.ts already allows
// the googletagmanager / google-analytics origins these scripts use.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
