"use client";

import { useState, useTransition } from "react";
import { savePost, deletePost, type PostPayload } from "@/app/admin/(panel)/blog/actions";
import { ImageUpload } from "./fields";
import { slugify } from "@/lib/utils";
import shared from "./shared.module.css";
import styles from "./PackageForm.module.css";

interface PostFormProps {
  initial?: Partial<PostPayload> & { id?: string };
}

export default function PostForm({ initial }: PostFormProps) {
  const isEdit = Boolean(initial?.id);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [author, setAuthor] = useState(initial?.author ?? "VMF Holidays");
  const [tags, setTags] = useState(initial?.tags ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);

  // Auto-fill the slug from the title until the editor types one manually.
  function handleTitle(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await savePost({
        id: initial?.id,
        title,
        slug,
        excerpt,
        content,
        coverImage,
        author,
        tags,
        published,
      });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={`${shared.panel} ${shared.panelPad}`}>
        <div className={shared.formGrid}>
          <div className={`form-group ${shared.formFull}`}>
            <label className="form-label" htmlFor="p-title">Title</label>
            <input
              id="p-title"
              className="form-input"
              value={title}
              required
              placeholder="e.g. 7 Hidden Beaches in South Goa Worth the Detour"
              onChange={(e) => handleTitle(e.target.value)}
            />
          </div>
          <div className={`form-group ${shared.formFull}`}>
            <label className="form-label" htmlFor="p-slug">URL slug</label>
            <input
              id="p-slug"
              className="form-input"
              value={slug}
              placeholder="hidden-beaches-south-goa"
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
            />
            <p className={shared.fieldHint}>Lives at /blog/{slug || "…"}</p>
          </div>
          <div className={`form-group ${shared.formFull}`}>
            <label className="form-label" htmlFor="p-excerpt">Excerpt</label>
            <textarea
              id="p-excerpt"
              className="form-textarea"
              rows={2}
              value={excerpt}
              required
              placeholder="One or two sentences shown on the blog listing and in search results."
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="p-author">Author</label>
            <input
              id="p-author"
              className="form-input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="p-tags">Tags</label>
            <input
              id="p-tags"
              className="form-input"
              value={tags}
              placeholder="Goa, Beaches, Travel Tips"
              onChange={(e) => setTags(e.target.value)}
            />
            <p className={shared.fieldHint}>Comma-separated.</p>
          </div>
        </div>
      </div>

      <div className={`${shared.panel} ${shared.panelPad}`}>
        <ImageUpload label="Cover image" value={coverImage} onChange={setCoverImage} />
      </div>

      <div className={`${shared.panel} ${shared.panelPad}`}>
        <div className={`form-group ${shared.formFull}`}>
          <label className="form-label" htmlFor="p-content">Content</label>
          <textarea
            id="p-content"
            className="form-textarea"
            rows={18}
            value={content}
            required
            placeholder={"Write the post here.\n\nLeave a blank line between paragraphs. Start a line with # for a heading and - for a bullet point."}
            onChange={(e) => setContent(e.target.value)}
          />
          <p className={shared.fieldHint}>
            Blank line = new paragraph · line starting with <code>#</code> = heading · line starting with <code>-</code> = bullet.
          </p>
        </div>
      </div>

      <div className={`${shared.panel} ${shared.panelPad}`}>
        <label className={styles.featuredRow}>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <span>Published on website</span>
        </label>
      </div>

      {error && <p className={shared.error}>{error}</p>}

      <div className={shared.formActions}>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save Changes" : "Create Post"}
        </button>
        {isEdit && initial?.id && (
          <button
            type="button"
            className={shared.dangerBtn}
            disabled={pending}
            onClick={() => {
              if (confirm("Delete this post?")) {
                startTransition(() => deletePost(initial.id!));
              }
            }}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
