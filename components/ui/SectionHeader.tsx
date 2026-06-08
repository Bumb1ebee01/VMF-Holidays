import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  sub?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeader({ eyebrow, title, sub, centered, light }: SectionHeaderProps) {
  return (
    <div className={`${styles.header} ${centered ? styles.centered : ""} ${light ? styles.light : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className={`section-title ${light ? styles.titleLight : ""}`}>{title}</h2>
      <div className="divider" />
      {sub && <p className="section-sub">{sub}</p>}
    </div>
  );
}
