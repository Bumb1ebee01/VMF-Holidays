import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { getPostBySlug, getPublishedPosts, getAllDestinations } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { JsonLd, postJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import PostBody from "@/components/blog/PostBody";
import styles from "./page.module.css";

export async function generateStaticParams() {
  const rows = await db.post.findMany({ where: { published: true }, select: { slug: true } });
  return rows.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author],
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [allPosts, dests] = await Promise.all([getPublishedPosts(), getAllDestinations()]);
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const haystack = `${post.title} ${post.tags.join(" ")}`.toLowerCase();
  const guideMatches = dests.filter((d) => haystack.includes(d.name.toLowerCase())).slice(0, 3);

  return (
    <article className={styles.page}>
      <JsonLd
        data={[
          postJsonLd(post),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <div className={styles.breadcrumb}>
            <Link href="/blog">Blog</Link>
            <span>/</span>
            <span>{post.tags[0] ?? "Article"}</span>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.meta}>
            By {post.author}
            {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ""}
          </p>
        </div>
      </header>

      {post.coverImage && (
        <div className="container">
          <div className={styles.cover}>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 900px) 100vw, 880px"
              className={styles.coverImg}
              priority
            />
          </div>
        </div>
      )}

      <div className={`container ${styles.bodyWrap}`}>
        <p className={styles.lede}>{post.excerpt}</p>
        <PostBody content={post.content} />

        {post.tags.length > 0 && (
          <div className={styles.tags}>
            {post.tags.map((t) => (
              <span key={t} className={styles.tagChip}>{t}</span>
            ))}
          </div>
        )}

        <div className={styles.guideBlock}>
          <h3 className={styles.guideBlockTitle}>Plan this trip</h3>
          {guideMatches.length > 0 ? (
            <>
              <p className={styles.guideBlockSub}>
                Read our destination guides for the best time to visit and the top things to do:
              </p>
              <div className={styles.guideLinks}>
                {guideMatches.map((d) => (
                  <Link key={d.slug} href={`/guides/${d.slug}`} className={styles.guideLink}>
                    {d.name} Travel Guide →
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <p className={styles.guideBlockSub}>
              Browse our <Link href="/guides" className={styles.guideInline}>destination travel guides</Link> for the
              best time to visit and top things to do, then build your itinerary.
            </p>
          )}
        </div>

        <div className={styles.cta}>
          <div>
            <h3 className={styles.ctaTitle}>Ready to plan your own trip?</h3>
            <p className={styles.ctaSub}>Tell us where you want to go — we&apos;ll build the itinerary.</p>
          </div>
          <Link href="/trip-builder" className="btn btn-primary">Start Planning</Link>
        </div>
      </div>

      {related.length > 0 && (
        <div className={styles.related}>
          <div className="container">
            <h2 className={styles.relatedTitle}>More from the journal</h2>
            <div className={styles.relatedGrid}>
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className={styles.relatedCard}>
                  <div className={styles.relatedImg}>
                    {p.coverImage ? (
                      <Image src={p.coverImage} alt={p.title} fill sizes="(max-width: 640px) 100vw, 33vw" className={styles.coverImg} />
                    ) : (
                      <div className={styles.relatedFallback} />
                    )}
                  </div>
                  <h3 className={styles.relatedCardTitle}>{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
