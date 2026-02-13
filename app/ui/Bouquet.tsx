"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "./bouquet.module.css";

type Props = {
  header: string;
  subheader: string;
  message: string;
  fromText: string;
};

type FlowerVariant = "rose" | "tulip" | "peony";

type BouquetItem = {
  left: string;
  height: string;
  rot: string;
  delayMs: number;
  thickness?: number;
  flower: {
    variant: FlowerVariant;
    scale: number;
    petal: string;
    petal2?: string;
    petal3?: string;
    center?: string;
  };
};

type BreathDot = {
  left: string;
  bottom: string;
  delayMs: number;
  size: number;
  opacity: number;
};

type CSSVars = React.CSSProperties & { [key: `--${string}`]: string | number };

export default function Bouquet({ header, subheader, message, fromText }: Props) {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const heartLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 380);
    return () => clearTimeout(t);
  }, []);

  // ✅ full-page animated heart background
  const pageHearts = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        id: i,
        left: `${4 + ((i * 7) % 92)}%`,
        top: `${8 + ((i * 9) % 80)}%`,
        size: 12 + ((i * 5) % 18),
        delay: i * 220,
        dur: 5200 + (i % 7) * 650,
        opacity: 0.05 + (i % 5) * 0.02,
      })),
    []
  );

  function burstHearts(clientX: number, clientY: number) {
    const layer = heartLayerRef.current;
    if (!layer) return;

    const rect = layer.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const count = 16;
    for (let i = 0; i < count; i++) {
      const h = document.createElement("span");
      h.className = styles.heartBurst;

      const dx = (Math.random() - 0.5) * 220;
      const dy = (Math.random() - 1.0) * 240;
      const r = Math.random() * 360;
      const s = 0.65 + Math.random() * 0.95;
      const d = Math.random() * 120;

      h.style.left = `${x}px`;
      h.style.top = `${y}px`;
      h.style.setProperty("--dx", `${dx}px`);
      h.style.setProperty("--dy", `${dy}px`);
      h.style.setProperty("--r", `${r}deg`);
      h.style.setProperty("--s", `${s}`);
      h.style.animationDelay = `${d}ms`;

      const palette = [
        "rgba(255, 54, 120, 0.92)",
        "rgba(255, 98, 170, 0.92)",
        "rgba(255, 120, 120, 0.90)",
        "rgba(255, 255, 255, 0.92)",
      ];
      h.style.setProperty("--heart", palette[Math.floor(Math.random() * palette.length)]);

      layer.appendChild(h);
      h.addEventListener("animationend", () => h.remove());
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    burstHearts(e.clientX, e.clientY);
  }

  // subtle hearts inside bouquet container
  const floatHearts = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        left: `${8 + ((i * 9) % 84)}%`,
        top: `${18 + ((i * 11) % 68)}%`,
        size: 10 + ((i * 5) % 10),
        delay: i * 320,
        dur: 5200 + (i % 5) * 700,
        opacity: 0.08 + (i % 4) * 0.03,
      })),
    []
  );

  // palette requested: orange, pink, white, pink, light pink & white
  const items: BouquetItem[] = [
    { left: "18%", height: "78%", rot: "-12deg", delayMs: 80, thickness: 10, flower: { variant: "rose", scale: 0.96, petal: "#ff5aa7", petal2: "#ff9fca", petal3: "#ffe0f0", center: "#ffd36a" } },
    { left: "30%", height: "96%", rot: "-6deg", delayMs: 180, thickness: 10, flower: { variant: "tulip", scale: 0.92, petal: "#ff8a2a", petal2: "#ffd0a8", petal3: "#ffe7d3", center: "#ffe08a" } },
    { left: "44%", height: "82%", rot: "0deg", delayMs: 260, thickness: 10, flower: { variant: "peony", scale: 1.08, petal: "#ffffff", petal2: "#fff6fb", petal3: "#ffeaf3", center: "#ffcc4d" } },
    { left: "52%", height: "98%", rot: "6deg", delayMs: 340, thickness: 11, flower: { variant: "rose", scale: 1.10, petal: "#ff3f98", petal2: "#ff82bd", petal3: "#ffb6d7", center: "#ffd36a" } },
    { left: "64%", height: "76%", rot: "8deg", delayMs: 520, thickness: 10, flower: { variant: "peony", scale: 1.02, petal: "#ffd6ea", petal2: "#fff0f7", petal3: "#ffffff", center: "#ffcc4d" } },
    { left: "76%", height: "84%", rot: "12deg", delayMs: 650, thickness: 10, flower: { variant: "peony", scale: 1.04, petal: "#ffffff", petal2: "#eef9ff", petal3: "#dff3ff", center: "#ffcc4d" } },
  ];

  const breathDots: BreathDot[] = [
    { left: "18%", bottom: "28%", delayMs: 760, size: 7, opacity: 0.95 },
    { left: "26%", bottom: "22%", delayMs: 820, size: 6, opacity: 0.92 },
    { left: "34%", bottom: "26%", delayMs: 860, size: 7, opacity: 0.94 },
    { left: "44%", bottom: "18%", delayMs: 920, size: 6, opacity: 0.90 },
    { left: "52%", bottom: "26%", delayMs: 980, size: 7, opacity: 0.95 },
    { left: "60%", bottom: "22%", delayMs: 1040, size: 6, opacity: 0.92 },
    { left: "68%", bottom: "18%", delayMs: 1100, size: 7, opacity: 0.94 },
    { left: "76%", bottom: "26%", delayMs: 1160, size: 6, opacity: 0.90 },
  ];

  return (
    <div className={styles.scene}>
      <div className={styles.bg} aria-hidden />
      <div className={styles.glow} aria-hidden />
      <div className={styles.grain} aria-hidden />

      {/* ✅ page background hearts */}
      <div className={styles.pageHearts} aria-hidden>
        {pageHearts.map((h) => (
          <span
            key={h.id}
            className={styles.pageHeart}
            style={{
              left: h.left,
              top: h.top,
              width: `${h.size}px`,
              height: `${h.size}px`,
              opacity: h.opacity,
              animationDelay: `${h.delay}ms`,
              animationDuration: `${h.dur}ms`,
            }}
          />
        ))}
      </div>

      <div className={styles.card}>
        <header className={styles.header}>
          <div className={styles.chip}>💐</div>
          <h1 className={styles.title}>{header}</h1>
          <p className={styles.subheader}>{subheader}</p>
          <p className={styles.hint}>Tap the bouquet for hearts</p>
        </header>

        <div className={styles.stage}>
          <div
            className={`${styles.bouquetArea} ${open ? styles.opened : ""}`}
            onPointerDown={onPointerDown}
            role="application"
            aria-label="Bouquet animation"
          >
            {/* hearts inside bouquet container */}
            <div className={styles.floatHeartLayer} aria-hidden>
              {floatHearts.map((h) => {
                const st: CSSVars = {
                  left: h.left,
                  top: h.top,
                  width: `${h.size}px`,
                  height: `${h.size}px`,
                  opacity: h.opacity,
                  animationDelay: `${h.delay}ms`,
                  animationDuration: `${h.dur}ms`,
                };
                return <span key={h.id} className={styles.floatHeart} style={st} />;
              })}
            </div>

            <div className={styles.frame} aria-hidden>
              <div className={styles.paperBack} />
              <div className={styles.paperFront} />
              <div className={styles.paperFold} />
              <div className={styles.cellophane} />
              <div className={styles.softHighlight} />
              <div className={styles.flapLeft} />
              <div className={styles.flapRight} />
            </div>

            <div className={styles.decor} aria-hidden>
              <div className={styles.eucLeft} />
              <div className={styles.eucRight} />
              {breathDots.map((d, i) => {
                const st: CSSVars = {
                  left: d.left,
                  bottom: d.bottom,
                  width: `${d.size}px`,
                  height: `${d.size}px`,
                  opacity: d.opacity,
                  ["--bdelay" as `--${string}`]: `${d.delayMs}ms`,
                };
                return <span key={i} className={styles.breathDot} style={st} />;
              })}
            </div>

            <div className={styles.stems} aria-hidden>
              {items.map((it, i) => {
                const stemStyle: CSSVars = {
                  left: it.left,
                  height: it.height,
                  width: `${it.thickness ?? 10}px`,
                  ["--rot" as `--${string}`]: it.rot,
                  ["--delay" as `--${string}`]: `${it.delayMs}ms`,
                };

                const flowerStyle: CSSVars = {
                  ["--scale" as `--${string}`]: it.flower.scale,
                  ["--petal" as `--${string}`]: it.flower.petal,
                  ["--petal2" as `--${string}`]: it.flower.petal2 ?? it.flower.petal,
                  ["--petal3" as `--${string}`]: it.flower.petal3 ?? it.flower.petal2 ?? it.flower.petal,
                  ["--center" as `--${string}`]: it.flower.center ?? "#ffcc4d",
                  ["--fdelay" as `--${string}`]: `${it.delayMs + 720}ms`,
                };

                return (
                  <div key={i} className={styles.stem} style={stemStyle}>
                    <div className={styles.leaf} />
                    <div className={`${styles.leaf} ${styles.leaf2}`} />
                    <div className={styles.flowerOnStem} style={flowerStyle}>
                      <FlowerSVG uid={`${uid}-${i}`} variant={it.flower.variant} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.ribbon} aria-hidden />
            <div className={styles.knot} aria-hidden />
            <div className={styles.tailL} aria-hidden />
            <div className={styles.tailR} aria-hidden />

            {/* click/tap burst hearts */}
            <div ref={heartLayerRef} className={styles.heartLayer} aria-hidden />
          </div>
        </div>

        <footer className={styles.footer}>
          <p className={styles.message}>{message}</p>
          <p className={styles.from}>{fromText}</p>
        </footer>
      </div>
    </div>
  );
}

/* ========= Flower SVGs ========= */

function FlowerSVG({ variant, uid }: { variant: FlowerVariant; uid: string }) {
  if (variant === "tulip") return <Tulip uid={uid} />;
  if (variant === "peony") return <Peony uid={uid} />;
  return <Rose uid={uid} />;
}

function Rose({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 210 230" className={styles.svg} role="img" aria-label="Rose">
      <defs>
        <radialGradient id={`rosePetal-${uid}`} cx="35%" cy="25%">
          <stop offset="0%" stopColor="var(--petal3)" />
          <stop offset="50%" stopColor="var(--petal2)" />
          <stop offset="100%" stopColor="var(--petal)" />
        </radialGradient>
        <linearGradient id={`roseGreen-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6af0a8" />
          <stop offset="100%" stopColor="#149a60" />
        </linearGradient>
        <filter id={`roseShadow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="18" stdDeviation="12" floodColor="rgba(0,0,0,0.16)" />
        </filter>
      </defs>

      <g filter={`url(#roseShadow-${uid})`}>
        <path
          d="M105 176 C98 179 92 186 92 196 C92 207 99 216 105 222
             C111 216 118 207 118 196 C118 186 112 179 105 176 Z"
          fill={`url(#roseGreen-${uid})`}
        />
        <path
          d="M105 160
             C85 166 72 184 72 206
             C84 190 96 190 105 190
             C114 190 126 190 138 206
             C138 184 125 166 105 160 Z"
          fill={`url(#roseGreen-${uid})`}
          opacity="0.95"
        />

        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={i}
            d="M105 20
               C88 42, 82 68, 90 90
               C96 106, 114 106, 120 90
               C128 68, 122 42, 105 20 Z"
            fill={`url(#rosePetal-${uid})`}
            transform={`rotate(${i * 30} 105 105)`}
            opacity="0.95"
          />
        ))}

        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={i}
            d="M105 44
               C94 60, 90 78, 94 94
               C98 110, 112 112, 116 94
               C120 78, 116 60, 105 44 Z"
            fill="rgba(255,255,255,0.12)"
            transform={`rotate(${i * 45} 105 105)`}
          />
        ))}

        <circle cx="105" cy="110" r="10" fill="var(--center)" opacity="0.55" />
      </g>
    </svg>
  );
}

function Peony({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 220 230" className={styles.svg} role="img" aria-label="Peony">
      <defs>
        <radialGradient id={`peonyPetal-${uid}`} cx="35%" cy="25%">
          <stop offset="0%" stopColor="var(--petal3)" />
          <stop offset="55%" stopColor="var(--petal2)" />
          <stop offset="100%" stopColor="var(--petal)" />
        </radialGradient>
        <linearGradient id={`peonyGreen-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6af0a8" />
          <stop offset="100%" stopColor="#149a60" />
        </linearGradient>
        <filter id={`peonyShadow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="rgba(0,0,0,0.16)" />
        </filter>
      </defs>

      <g filter={`url(#peonyShadow-${uid})`}>
        <path
          d="M110 178 C103 181 97 188 97 197 C97 208 104 216 110 222
             C116 216 123 208 123 197 C123 188 117 181 110 178 Z"
          fill={`url(#peonyGreen-${uid})`}
        />
        <path
          d="M110 162
             C90 168 76 186 76 208
             C88 192 100 192 110 192
             C120 192 132 192 144 208
             C144 186 130 168 110 162 Z"
          fill={`url(#peonyGreen-${uid})`}
          opacity="0.95"
        />

        {Array.from({ length: 18 }).map((_, i) => (
          <path
            key={i}
            d="M110 24
               C92 44, 88 70, 96 94
               C104 118, 116 118, 124 94
               C132 70, 128 44, 110 24 Z"
            fill={`url(#peonyPetal-${uid})`}
            transform={`rotate(${i * 20} 110 110)`}
            opacity="0.92"
          />
        ))}

        {Array.from({ length: 10 }).map((_, i) => (
          <path
            key={i}
            d="M110 56
               C100 70, 98 86, 102 100
               C106 114, 114 114, 118 100
               C122 86, 120 70, 110 56 Z"
            fill="rgba(255,255,255,0.16)"
            transform={`rotate(${i * 36} 110 110)`}
          />
        ))}

        <circle cx="110" cy="116" r="12" fill="var(--center)" opacity="0.55" />
      </g>
    </svg>
  );
}

function Tulip({ uid }: { uid: string }) {
  return (
    <svg viewBox="0 0 190 240" className={styles.svg} role="img" aria-label="Tulip">
      <defs>
        <linearGradient id={`tulipPetal-${uid}`} x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="var(--petal3)" />
          <stop offset="40%" stopColor="var(--petal2)" />
          <stop offset="100%" stopColor="var(--petal)" />
        </linearGradient>
        <linearGradient id={`tulipGreen-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#66e6a0" />
          <stop offset="100%" stopColor="#149a60" />
        </linearGradient>
        <filter id={`tulipShadow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="rgba(0,0,0,0.16)" />
        </filter>
      </defs>

      <g filter={`url(#tulipShadow-${uid})`}>
        <path
          d="M95 186 C88 189 82 196 82 205 C82 216 89 224 95 230
             C101 224 108 216 108 205 C108 196 102 189 95 186 Z"
          fill={`url(#tulipGreen-${uid})`}
          opacity="0.96"
        />
        <path
          d="M95 170
             C76 176 62 194 62 216
             C76 200 86 198 95 198
             C104 198 114 200 128 216
             C128 194 114 176 95 170 Z"
          fill={`url(#tulipGreen-${uid})`}
          opacity="0.95"
        />

        <path
          d="M95 22
             C64 46, 56 88, 66 124
             C76 160, 88 176, 95 184
             C102 176, 114 160, 124 124
             C134 88, 126 46, 95 22 Z"
          fill={`url(#tulipPetal-${uid})`}
        />
        <path
          d="M95 34
             C78 54, 76 84, 80 114
             C84 142, 90 160, 95 170
             C100 160, 106 142, 110 114
             C114 84, 112 54, 95 34 Z"
          fill="rgba(255,255,255,0.18)"
        />

        <circle cx="95" cy="126" r="10" fill="var(--center)" opacity="0.6" />
      </g>
    </svg>
  );
}
