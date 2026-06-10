"use client";
import { useEffect, useState } from "react";
import styles from "./PageLoader.module.css";

export default function PageLoader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`${styles.loader} ${hidden ? styles.hidden : ""}`} aria-hidden="true">
      <div className={styles.logo}>
        <span className={styles.vmf}>VMF</span>
        <span className={styles.hols}>Holidays</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} />
      </div>
      <p className={styles.tagline}>Discover Your World, Your Way</p>
    </div>
  );
}
