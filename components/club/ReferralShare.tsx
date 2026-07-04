"use client";

import ShareActions from "./ShareActions";

// The dashboard's referral-link sharer — now a thin wrapper over the shared
// ShareActions primitive so copy / native share / WhatsApp / email stay consistent.
export default function ReferralShare({ link }: { link: string }) {
  const message =
    "Plan your next trip with VMF Holidays — join the Travellers Club via my link and we both earn travel credit:";
  return <ShareActions link={link} message={message} showLink linkLabel="Your referral link" />;
}
