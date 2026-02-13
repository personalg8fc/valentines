"use client";

import styles from "./bouquet.module.css";

type Props = {
  headline: string;
  fromText: string;
};

export default function Bouquet({ headline, fromText }: Props) {
  return (
    <div className={styles.scene}>
      <div className={styles.backgroundGlow} />

      <div className={styles.card}>
        <div className={styles.textWrap}>
          <h1 className={styles.headline}>
            <span className={styles.sparkle} aria-hidden />
            {headline}
          </h1>
          <p className={styles.from}>{fromText}</p>
        </div>

        <div className={styles.bouquetWrap}>
          {/* ribbon */}
          <div className={styles.ribbon} />
          <div className={styles.ribbonTailLeft} />
          <div className={styles.ribbonTailRight} />

          {/* stems */}
          <div className={styles.stems}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className={`${styles.stem} ${styles[`s${i + 1}`]}`}>
                <div className={styles.leaf} />
                <div className={`${styles.leaf} ${styles.leaf2}`} />
              </div>
            ))}
          </div>

          {/* flowers (SVG) */}
          <div className={styles.flowers}>
            <Flower className={`${styles.flower} ${styles.f1}`} delayMs={0} />
            <Flower className={`${styles.flower} ${styles.f2}`} delayMs={140} />
            <Flower className={`${styles.flower} ${styles.f3}`} delayMs={280} />
            <Flower className={`${styles.flower} ${styles.f4}`} delayMs={420} />
            <Flower className={`${styles.flower} ${styles.f5}`} delayMs={560} />
            <Flower className={`${styles.flower} ${styles.f6}`} delayMs={700} />
            <Flower className={`${styles.flower} ${styles.f7}`} delayMs={840} />
          </div>
        </div>

        <div className={styles.hint}>Tap / click anywhere ✨</div>
      </div>

      {/* simple click sparkles */}
      <Sparkles />
    </div>
  );
}

function Flower({
  className,
  delayMs,
}: {
  className: string;
  delayMs: number;
}) {
  return (
    <svg
      className={className}
      style={{ animationDelay: `${delayMs}ms` }}
      width="90"
      height="90"
      viewBox="0 0 100 100"
      role="img"
      aria-label="Flower"
    >
      {/* petals */}
      <g className={styles.petals}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="50"
            cy="28"
            rx="12"
            ry="18"
            transform={`rotate(${i * 45} 50 50)`}
            className={styles.petal}
          />
        ))}
      </g>

      {/* center */}
      <circle cx="50" cy="50" r="12" className={styles.center} />

      {/* tiny highlight */}
      <circle cx="45" cy="46" r="4" className={styles.centerHighlight} />
    </svg>
  );
}

function Sparkles() {
  // tiny DOM-based sparkles with CSS animation
  function pop(e: React.MouseEvent<HTMLDivElement>) {
    const root = e.currentTarget;
    const rect = root.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = 0; i < 10; i++) {
      const s = document.createElement("span");
      s.className = styles.spark;
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      s.style.setProperty("--dx", `${(Math.random() - 0.5) * 140}px`);
      s.style.setProperty("--dy", `${(Math.random() - 0.8) * 160}px`);
      s.style.setProperty("--r", `${Math.random() * 360}deg`);
      s.style.animationDelay = `${Math.random() * 80}ms`;
      root.appendChild(s);
      s.addEventListener("animationend", () => s.remove());
    }
  }

  return <div className={styles.sparkRoot} onClick={pop} aria-hidden />;
}
