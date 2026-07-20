import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTwoFactorPending } from "@/lib/auth/session";
import VerifyForm from "./VerifyForm";

export const metadata: Metadata = {
  title: "Two-factor verification",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function VerifyPage() {
  // No pending ticket means no password step was cleared — nothing to verify.
  const pending = await getTwoFactorPending();
  if (!pending) redirect("/admin/login");

  return <VerifyForm />;
}
