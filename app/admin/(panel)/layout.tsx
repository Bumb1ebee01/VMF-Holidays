import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/user";
import AdminSidebar from "@/components/admin/AdminSidebar";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | VMF Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireUser();

  return (
    <div className={styles.shell}>
      <AdminSidebar user={user} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
