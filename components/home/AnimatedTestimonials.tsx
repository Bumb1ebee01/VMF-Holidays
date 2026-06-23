"use client";

import { motion, useAnimation, useInView, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/lib/types";
import styles from "./AnimatedTestimonials.module.css";

function Star({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

interface Props {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  badgeText?: string;
  autoRotateInterval?: number;
}

export default function AnimatedTestimonials({
  testimonials,
  title = "What Our Travellers Say",
  subtitle = "Real stories from real people who trusted us with their most precious time.",
  badgeText = "Loved by travellers",
  autoRotateInterval = 6000,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  useEffect(() => {
    if (autoRotateInterval <= 0 || testimonials.length <= 1) return;
    const id = setInterval(
      () => setActiveIndex((c) => (c + 1) % testimonials.length),
      autoRotateInterval
    );
    return () => clearInterval(id);
  }, [autoRotateInterval, testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className="container">
        <motion.div initial="hidden" animate={controls} variants={containerVariants} className={styles.grid}>
          {/* Left: heading + navigation */}
          <motion.div variants={itemVariants} className={styles.left}>
            <div className={styles.badge}>
              <Star className={styles.badgeStar} />
              <span>{badgeText}</span>
            </div>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.sub}>{subtitle}</p>
            <div className={styles.dots}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`${styles.dot} ${activeIndex === i ? styles.dotActive : ""}`}
                  aria-label={`View testimonial ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Right: rotating testimonial card */}
          <motion.div variants={itemVariants} className={styles.right}>
            {testimonials.map((t, index) => (
              <motion.div
                key={index}
                className={styles.cardWrap}
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  x: activeIndex === index ? 0 : 100,
                  scale: activeIndex === index ? 1 : 0.9,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ zIndex: activeIndex === index ? 10 : 0 }}
              >
                <div className={styles.card}>
                  <div className={styles.stars}>
                    {Array.from({ length: Math.max(1, Math.min(5, t.rating)) }).map((_, i) => (
                      <Star key={i} className={styles.star} />
                    ))}
                  </div>

                  <div className={styles.quoteWrap}>
                    <span className={styles.quoteMark} aria-hidden="true">&ldquo;</span>
                    <p className={styles.quoteText}>{t.quote}</p>
                  </div>

                  <hr className={styles.separator} />

                  <div className={styles.author}>
                    <div className={styles.avatar}>{t.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <h3 className={styles.authorName}>{t.name}</h3>
                      <p className={styles.authorRole}>
                        {[t.trip, t.location].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className={`${styles.deco} ${styles.decoBL}`} />
            <div className={`${styles.deco} ${styles.decoTR}`} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
