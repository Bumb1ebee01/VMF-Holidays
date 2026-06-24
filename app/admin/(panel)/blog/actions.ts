"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth/user";
import { logActivity } from "@/lib/activity";
import { slugify } from "@/lib/utils";

export interface PostPayload {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string;
  published: boolean;
}

export type SaveResult = { error: string } | undefined;

export async function savePost(payload: PostPayload): Promise<SaveResult> {
  const actor = await requirePermission("posts:manage");

  const title = payload.title.trim();
  if (!title) return { error: "Title is required." };
  const excerpt = payload.excerpt.trim();
  if (!excerpt) return { error: "A short excerpt is required." };
  if (!payload.content.trim()) return { error: "Post content is required." };

  const slug = (payload.slug.trim() ? slugify(payload.slug) : slugify(title)) || slugify(title);

  // Guard against slug collisions on a different post.
  const clash = await db.post.findUnique({ where: { slug } });
  if (clash && clash.id !== payload.id) {
    return { error: `The URL "/blog/${slug}" is already used by another post.` };
  }

  const tags = payload.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const data = {
    title,
    slug,
    excerpt,
    content: payload.content.trim(),
    coverImage: payload.coverImage.trim() || null,
    author: payload.author.trim() || "VMF Holidays",
    tags,
    published: payload.published,
    publishedAt: payload.published ? new Date() : null,
  };

  if (payload.id) {
    // Preserve the original publish date when editing an already-published post.
    const existing = await db.post.findUnique({ where: { id: payload.id } });
    if (existing?.published && payload.published && existing.publishedAt) {
      data.publishedAt = existing.publishedAt;
    }
    await db.post.update({ where: { id: payload.id }, data });
    await logActivity(actor, { action: "post.update", entity: "Post", entityId: payload.id, detail: `Updated blog post "${title}"` });
  } else {
    const created = await db.post.create({ data });
    await logActivity(actor, { action: "post.create", entity: "Post", entityId: created.id, detail: `Created blog post "${title}"` });
  }

  revalidatePath("/", "layout");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deletePost(id: string) {
  const actor = await requirePermission("posts:manage");
  const post = await db.post.delete({ where: { id } });
  await logActivity(actor, { action: "post.delete", entity: "Post", entityId: id, detail: `Deleted blog post "${post.title}"` });
  revalidatePath("/", "layout");
  revalidatePath("/blog");
  redirect("/admin/blog");
}
