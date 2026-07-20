"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { COOKIE_CONSENT_KEY, COOKIE_CONSENT_EVENT } from "@/components/ui/CookieConsent";

// Google Analytics 4 — loads only when NEXT_PUBLIC_GA_ID is set AND the visitor
// has accepted analytics cookies (DPDP: consent before non-essential cookies).
// Until both are true this renders nothing, so the site stays cookie-free. The
// CSP in next.config.ts already allows the googletagmanager / google-analytics
// origins these scripts use.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    const read = () => {
      try {
        setConsented(localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted");
      } catch {
        setConsented(false);
      }
    };
    read();
    window.addEventListener(COOKIE_CONSENT_EVENT, read);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, read);
  }, []);

  if (!GA_ID || !consented) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
