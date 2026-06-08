import type { EnquiryPayload } from "@/lib/types";

const WHATSAPP_NUMBER = "917499322412";

export function buildWhatsAppLink(payload: EnquiryPayload): string {
  const lines: string[] = [
    `Hi VMF Holidays! I'd like to enquire about a trip.`,
    ``,
    `*Name:* ${payload.name}`,
    `*Phone:* ${payload.phone}`,
    `*Email:* ${payload.email}`,
  ];

  if (payload.packageTitle) lines.push(`*Package:* ${payload.packageTitle}`);
  if (payload.destination) lines.push(`*Destination:* ${payload.destination}`);
  if (payload.dates) lines.push(`*Travel Dates:* ${payload.dates}`);
  if (payload.travelers) lines.push(`*Travelers:* ${payload.travelers}`);
  if (payload.budget) lines.push(`*Budget:* ${payload.budget}`);
  if (payload.interests?.length) lines.push(`*Interests:* ${payload.interests.join(", ")}`);
  if (payload.message) lines.push(``, `*Message:* ${payload.message}`);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
