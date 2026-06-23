import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { truncate } from "@/lib/utils";
import { IconStar } from "@/components/admin/icons";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Testimonials" };
export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await db.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  const published = testimonials.filter((t) => t.published).length;

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS</p>
          <h1 className={shared.pageTitle}>Testimonials</h1>
          <p className={shared.pageSub}>
            {published} published of {testimonials.length} total.
          </p>
        </div>
        <Link href="/admin/testimonials/new" className="btn btn-primary btn--sm">
          + New Testimonial
        </Link>
      </div>

      <div className={shared.panel}>
        {testimonials.length === 0 ? (
          <div className={shared.emptyState}>
            <IconStar size={28} />
            <p>No testimonials yet.</p>
          </div>
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
                    <div className={shared.cellMain}>
                      <span className={shared.thumbAvatar}>{t.name.charAt(0)}</span>
                      <div className={shared.cellText}>
                        <Link href={`/admin/testimonials/${t.id}`} className={shared.rowLink}>
                          {t.name}
                        </Link>
                        <span className={shared.cellSub}>{t.location}</span>
                      </div>
                    </div>
                  </td>
                  <td>{t.trip || "—"}</td>
                  <td>
                    <span className={shared.stars}>
                      {"★".repeat(t.rating)}
                      <span className={shared.starsMuted}>{"★".repeat(5 - t.rating)}</span>
                    </span>
                  </td>
                  <td className={shared.tagText}>{truncate(t.quote, 70)}</td>
                  <td>
                    <span className={`${shared.flag} ${t.published ? shared.flagOn : shared.flagOff}`}>
                      {t.published ? "Published" : "Hidden"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
