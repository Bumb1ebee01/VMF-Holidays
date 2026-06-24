import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Travel Blog",
  description:
    "Travel guides, destination tips and inspiration from the VMF Holidays team — plan smarter and travel better.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className="container">
          <span className="eyebrow">VMF Journal</span>
          <h1 className={styles.heroTitle}>Travel stories, guides &amp; inspiration</h1>
          <p className={styles.heroSub}>
            Insider tips, destination deep-dives and everything you need to plan a better trip.
          </p>
        </div>
      </div>

      <div className="container">
        {posts.length === 0 ? (
          <div className={styles.empty}>
            <p>Our first stories are on their way. Check back soon.</p>
            <Link href="/trip-builder" className="btn btn-primary">
              Start planning your trip
            </Link>
          </div>
        ) : (
          <>
            {featured && (
              <Link href={`/blog/${featured.slug}`} className={styles.feature}>
                <div className={styles.featureImg}>
                  {featured.coverImage ? (
                    <Image
                      src={featured.coverImage}
                      alt={featured.title}
                      fill
                      sizes="(max-width: 900px) 100vw, 1200px"
                      className={styles.img}
                      priority
                    />
                  ) : (
                    <div className={styles.imgFallback} />
                  )}
                </div>
                <div className={styles.featureBody}>
                  <span className="badge badge-orange">Latest</span>
                  <h2 className={styles.featureTitle}>{featured.title}</h2>
                  <p className={styles.featureExcerpt}>{featured.excerpt}</p>
                  <span className={styles.meta}>
                    {featured.author}
                    {featured.publishedAt ? ` · ${formatDate(featured.publishedAt)}` : ""}
                  </span>
                </div>
              </Link>
            )}

            {rest.length > 0 && (
              <div className={styles.grid}>
                {rest.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
                    <div className={styles.cardImg}>
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className={styles.img}
                        />
                      ) : (
                        <div className={styles.imgFallback} />
                      )}
                    </div>
                    <div className={styles.cardBody}>
                      {post.tags[0] && <span className={styles.tag}>{post.tags[0]}</span>}
                      <h3 className={styles.cardTitle}>{post.title}</h3>
                      <p className={styles.cardExcerpt}>{post.excerpt}</p>
                      <span className={styles.meta}>
                        {post.publishedAt ? formatDate(post.publishedAt) : "Draft"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
