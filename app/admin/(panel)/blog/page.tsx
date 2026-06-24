import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { truncate, formatDateTime } from "@/lib/utils";
import { IconBook } from "@/components/admin/icons";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await db.post.findMany({ orderBy: { createdAt: "desc" } });
  const published = posts.filter((p) => p.published).length;

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS</p>
          <h1 className={shared.pageTitle}>Blog</h1>
          <p className={shared.pageSub}>
            {published} published of {posts.length} total.
          </p>
        </div>
        <Link href="/admin/blog/new" className="btn btn-primary btn--sm">
          + New Post
        </Link>
      </div>

      <div className={shared.panel}>
        {posts.length === 0 ? (
          <div className={shared.emptyState}>
            <IconBook size={28} />
            <p>No blog posts yet. Write your first one.</p>
          </div>
        ) : (
          <table className={`${shared.table} ${shared.tableHover}`}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Updated</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className={shared.cellText}>
                      <Link href={`/admin/blog/${p.id}`} className={shared.rowLink}>
                        {p.title}
                      </Link>
                      <span className={shared.cellSub}>{truncate(p.excerpt, 80)}</span>
                    </div>
                  </td>
                  <td>{p.author}</td>
                  <td className={shared.tagText}>{formatDateTime(p.updatedAt)}</td>
                  <td>
                    <span className={`${shared.flag} ${p.published ? shared.flagOn : shared.flagOff}`}>
                      {p.published ? "Published" : "Draft"}
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
