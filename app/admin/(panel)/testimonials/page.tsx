import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { truncate } from "@/lib/utils";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Testimonials" };
export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await db.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS</p>
          <h1 className={shared.pageTitle}>Testimonials</h1>
          <p className={shared.pageSub}>
            {testimonials.filter((t) => t.published).length} published of {testimonials.length} total.
          </p>
        </div>
        <Link href="/admin/testimonials/new" className="btn btn-primary btn--sm">
          + New Testimonial
        </Link>
      </div>

      <div className={shared.panel}>
        {testimonials.length === 0 ? (
          <p className={shared.empty}>No testimonials yet.</p>
        ) : (
          <table className={`${shared.table} ${shared.tableHover}`}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Trip</th>
                <th>Rating</th>
                <th>Quote</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id}>
                  <td>
                    <Link href={`/admin/testimonials/${t.id}`} className={shared.rowLink}>
                      {t.name}
                    </Link>
                  </td>
                  <td>{t.trip || "—"}</td>
                  <td>{"★".repeat(t.rating)}</td>
                  <td>{truncate(t.quote, 70)}</td>
                  <td>{t.published ? "Published" : "Hidden"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
