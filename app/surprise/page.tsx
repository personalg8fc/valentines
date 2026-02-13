"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./surprise.module.css";

type FlowerVariant = "rose" | "tulip" | "peony";

type FlowerStyle = {
  variant: FlowerVariant;
  scale: number;
  petal: string;
  petal2: string;
  petal3: string;
  center: string;
};

type BouquetItem = {
  left: string;
  height: string;
  rot: string;
  delayMs: number;
  thickness: number;
  flower: FlowerStyle;
};

type Droplet = {
  id: string;
  left: string;
  size: string;
  dur: string;
  delay: string;
  drift: string;
  opacity: number;
};

type Burst = {
  id: string;
  x: number;
  y: number;
  dx: string;
  dy: string;
  r: string;
  s: string;
  heart: string;
  delay: number;
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}
function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function FlowerSVG({ f }: { f: FlowerStyle }) {
  const s = f.scale;

  if (f.variant === "tulip") {
    return (
      <svg className={styles.svg} viewBox="0 0 200 200" aria-hidden>
        <g transform={`translate(100 110) scale(${s}) translate(-100 -110)`}>
          <path
            d="M100 48 C 78 52 64 76 70 98 C 75 116 88 134 100 144 C 112 134 125 116 130 98 C 136 76 122 52 100 48 Z"
            fill={f.petal}
          />
          <path
            d="M100 56 C 88 58 80 76 84 94 C 88 110 94 122 100 130 C 106 122 112 110 116 94 C 120 76 112 58 100 56 Z"
            fill={f.petal2}
            opacity="0.95"
          />
          <path
            d="M100 64 C 94 66 90 78 92 90 C 94 102 97 110 100 114 C 103 110 106 102 108 90 C 110 78 106 66 100 64 Z"
            fill={f.petal3}
            opacity="0.9"
          />
          <circle cx="100" cy="102" r="11" fill={f.center} />
          <circle cx="96" cy="98" r="4" fill="rgba(255,255,255,0.65)" />
        </g>
      </svg>
    );
  }

  if (f.variant === "rose") {
    return (
      <svg className={styles.svg} viewBox="0 0 200 200" aria-hidden>
        <g transform={`translate(100 100) scale(${s}) translate(-100 -100)`}>
          <path
            d="M100 52 C 74 52 56 70 60 92 C 64 114 80 136 100 148 C 120 136 136 114 140 92 C 144 70 126 52 100 52 Z"
            fill={f.petal}
          />
          <path
            d="M100 62 C 84 62 72 74 74 90 C 76 108 86 124 100 132 C 114 124 124 108 126 90 C 128 74 116 62 100 62 Z"
            fill={f.petal2}
            opacity="0.96"
          />
          <path
            d="M100 74 C 92 74 86 80 88 90 C 90 102 94 110 100 114 C 106 110 110 102 112 90 C 114 80 108 74 100 74 Z"
            fill={f.petal3}
            opacity="0.92"
          />
          <circle cx="100" cy="98" r="10" fill={f.center} />
          <circle cx="96" cy="94" r="4" fill="rgba(255,255,255,0.65)" />
        </g>
      </svg>
    );
  }

  return (
    <svg className={styles.svg} viewBox="0 0 200 200" aria-hidden>
      <g transform={`translate(100 100) scale(${s}) translate(-100 -100)`}>
        {Array.from({ length: 10 }).map((_, i) => (
          <g key={i} transform={`translate(100 100) rotate(${i * 36}) translate(0 -52)`}>
            <path
              d="M0 -42 C 22 -38 38 -18 30 4 C 22 26 6 40 0 44 C -6 40 -22 26 -30 4 C -38 -18 -22 -38 0 -42 Z"
              fill={i % 3 === 0 ? f.petal : i % 3 === 1 ? f.petal2 : f.petal3}
              opacity={0.95}
            />
          </g>
        ))}
        <circle cx="100" cy="100" r="16" fill={f.center} />
        <circle cx="94" cy="94" r="6" fill="rgba(255,255,255,0.70)" />
      </g>
    </svg>
  );
}

export default function SurprisePage() {
  const areaRef = useRef<HTMLDivElement | null>(null);
  const [opened, setOpened] = useState(false);

  // ✅ hydration-safe droplets: create AFTER mount only
  const [droplets, setDroplets] = useState<Droplet[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    const t = window.setTimeout(() => setOpened(true), 220);

    const d: Droplet[] = Array.from({ length: 26 }).map((_, i) => ({
      id: `d${i}-${uid()}`,
      left: `${Math.round(rand(0, 100))}%`,
      size: `${Math.round(rand(10, 26))}px`,
      dur: `${Math.round(rand(4200, 7200))}ms`,
      delay: `${Math.round(rand(0, 2400))}ms`,
      drift: `${Math.round(rand(-30, 30))}px`,
      opacity: 0.08 + (i % 6) * 0.02,
    }));
    setDroplets(d);

    return () => window.clearTimeout(t);
  }, []);

  const items: BouquetItem[] = useMemo(
    () => [
      { left: "18%", height: "78%", rot: "-12deg", delayMs: 80, thickness: 10, flower: { variant: "rose", scale: 0.96, petal: "#ff5aa7", petal2: "#ff9fca", petal3: "#ffe0f0", center: "#ffd36a" } },
      { left: "30%", height: "96%", rot: "-6deg", delayMs: 180, thickness: 10, flower: { variant: "tulip", scale: 0.92, petal: "#ff8a2a", petal2: "#ffd0a8", petal3: "#ffe7d3", center: "#ffe08a" } },
      { left: "44%", height: "82%", rot: "0deg", delayMs: 260, thickness: 10, flower: { variant: "peony", scale: 1.08, petal: "#ffffff", petal2: "#fff6fb", petal3: "#ffeaf3", center: "#ffcc4d" } },
      { left: "52%", height: "98%", rot: "6deg", delayMs: 340, thickness: 11, flower: { variant: "rose", scale: 1.10, petal: "#ff3f98", petal2: "#ff82bd", petal3: "#ffb6d7", center: "#ffd36a" } },
      { left: "64%", height: "76%", rot: "8deg", delayMs: 520, thickness: 10, flower: { variant: "peony", scale: 1.02, petal: "#ffd6ea", petal2: "#fff0f7", petal3: "#ffffff", center: "#ffcc4d" } },
      { left: "76%", height: "84%", rot: "12deg", delayMs: 650, thickness: 10, flower: { variant: "peony", scale: 1.04, petal: "#ffffff", petal2: "#eef9ff", petal3: "#dff3ff", center: "#ffcc4d" } },
    ],
    []
  );

  const heartColors = useMemo(
    () => ["rgba(255,54,120,0.92)", "rgba(255,110,170,0.92)", "rgba(255,140,195,0.90)", "rgba(255,86,150,0.90)"],
    []
  );

  function spawnBurst(clientX: number, clientY: number) {
    const el = areaRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * 100;
    const y = ((clientY - r.top) / r.height) * 100;

    const batch: Burst[] = Array.from({ length: 12 }).map((_, i) => ({
      id: uid() + ":" + i,
      x,
      y,
      dx: `${Math.round(rand(-80, 80))}px`,
      dy: `${Math.round(rand(-120, -30))}px`,
      r: `${Math.round(rand(-25, 25))}deg`,
      s: `${rand(0.85, 1.25).toFixed(2)}`,
      heart: heartColors[Math.floor(Math.random() * heartColors.length)],
      delay: Math.round(rand(0, 120)),
    }));

    setBursts((prev) => [...prev, ...batch]);
    window.setTimeout(() => setBursts((prev) => prev.slice(batch.length)), 1100);
  }

  return (
    <div className={styles.scene}>
      <div className={styles.bg} aria-hidden />
      <div className={styles.glow} aria-hidden />
      <div className={styles.grain} aria-hidden />

      {/* ✅ hydration-safe droplet render (after mount) */}
      <div className={styles.droplets} aria-hidden>
        {droplets.map((d) => (
          <span
            key={d.id}
            className={styles.droplet}
            style={{
              left: d.left,
              width: d.size,
              height: d.size,
              opacity: d.opacity,
              animationDuration: d.dur,
              animationDelay: d.delay,
              ["--drift" as unknown as string]: d.drift,
            }}
          />
        ))}
      </div>

      <main className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.chip}>💗</div>
          <h1 className={styles.title}>HAPPY VALENTINE’S DAY JOELLA!</h1>
          <p className={styles.subtitle}>I LOVE YOU SO MUCH 💞</p>
          <p className={styles.hint}>Tap the bouquet for heart sparks ✨</p>
        </header>

        <section
          ref={areaRef}
          className={`${styles.bouquetArea} ${opened ? styles.opened : ""}`}
          onPointerDown={(e) => spawnBurst(e.clientX, e.clientY)}
          role="button"
          aria-label="Bouquet"
        >
          <div className={styles.frame} aria-hidden>
            <div className={styles.paperBack} />
            <div className={styles.paperFront} />
            <div className={styles.paperFold} />
            <div className={styles.softHighlight} />
            <div className={styles.flapLeft} />
            <div className={styles.flapRight} />
          </div>

          <div className={styles.decor} aria-hidden>
            <div className={styles.eucLeft} />
            <div className={styles.eucRight} />
          </div>

          <div className={styles.stems} aria-hidden>
            {items.map((it, idx) => (
              <div
                key={idx}
                className={styles.stem}
                style={{
                  left: it.left,
                  width: `${it.thickness}px`,
                  height: it.height,
                  ["--rot" as unknown as string]: it.rot,
                  ["--delay" as unknown as string]: `${it.delayMs}ms`,
                  ["--fdelay" as unknown as string]: `${it.delayMs + 520}ms`,
                  ["--scale" as unknown as string]: it.flower.scale,
                }}
              >
                <div className={styles.leaf} />
                <div className={`${styles.leaf} ${styles.leaf2}`} />
                <div className={styles.flowerOnStem}>
                  <FlowerSVG f={it.flower} />
                </div>
              </div>
            ))}
          </div>

          {/* click hearts */}
          <div className={styles.heartLayer} aria-hidden>
            {bursts.map((b) => (
              <span
                key={b.id}
                className={styles.heartBurst}
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  ["--dx" as unknown as string]: b.dx,
                  ["--dy" as unknown as string]: b.dy,
                  ["--r" as unknown as string]: b.r,
                  ["--s" as unknown as string]: b.s,
                  ["--heart" as unknown as string]: b.heart,
                  animationDelay: `${b.delay}ms`,
                }}
              />
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <p className={styles.message}>
            From: <strong>Jhoma Go</strong>
          </p>
        </footer>
      </main>
    </div>
  );
}
