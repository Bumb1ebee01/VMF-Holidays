"use client";

import { motion, useInView } from "framer-motion";
import { createElement, useRef, type ReactNode, type ElementType } from "react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Clip-mask slide-up reveal for a stack of lines.
 * Each line sits in an overflow-hidden box; the inner span rises from
 * translateY(115%) → 0 with a stagger. `play` gates the animation
 * (e.g. on the intro loader) — when false it stays hidden until true.
 */
export function LineReveal({
  lines,
  className,
  as = "span",
  play = true,
  delay = 0,
  stagger = 0.11,
  duration = 0.9,
}: {
  lines: ReactNode[];
  className?: string;
  as?: ElementType;
  play?: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const show = play && inView;

  return createElement(
    as,
    { ref, className },
    lines.map((line, i) => (
      <span key={i} style={{ display: "block", overflow: "hidden", paddingBottom: "0.14em" }}>
        <motion.span
          style={{ display: "block" }}
          initial={{ y: "115%", opacity: 0 }}
          animate={show ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 }}
          transition={{ duration, delay: delay + i * stagger, ease: EASE_OUT }}
        >
          {line}
        </motion.span>
      </span>
    ))
  );
}

/**
 * Clip-mask slide-up reveal, word by word (for big display headlines).
 */
export function WordReveal({
  text,
  className,
  as = "span",
  play = true,
  delay = 0,
  stagger = 0.14,
  duration = 1.0,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  play?: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const show = play && inView;
  const words = text.split(" ");

  return createElement(
    as,
    { ref, className },
    words.map((word, i) => (
      <span
        key={i}
        style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.12em", verticalAlign: "bottom", marginInlineEnd: i < words.length - 1 ? "0.27em" : 0 }}
      >
        <motion.span
          style={{ display: "inline-block" }}
          initial={{ y: "115%", opacity: 0 }}
          animate={show ? { y: "0%", opacity: 1 } : { y: "115%", opacity: 0 }}
          transition={{ duration, delay: delay + i * stagger, ease: EASE_OUT }}
        >
          {word}
        </motion.span>
        {i < words.length - 1 ? " " : ""}
      </span>
    ))
  );
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  y = 32,
  className,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-64px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: EASE_OUT as [number, number, number, number] }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  stagger = 0.09,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-64px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};
