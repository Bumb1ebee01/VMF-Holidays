import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import PostForm from "@/components/admin/PostForm";
import shared from "@/components/admin/shared.module.css";

export const metadata: Metadata = { title: "Edit Post" };
export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await db.post.findUnique({ where: { id } });
  if (!p) notFound();

  return (
    <div>
      <div className={shared.pageHeader}>
        <div>
          <p className={shared.kicker}>CMS · Blog</p>
          <h1 className={shared.pageTitle}>{p.title}</h1>
        </div>
      </div>
      <PostForm
        initial={{
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          content: p.content,
          coverImage: p.coverImage ?? "",
          author: p.author,
          tags: p.tags.join(", "),
          published: p.published,
        }}
      />
    </div>
  );
}
