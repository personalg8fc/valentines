"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./question.module.css";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}
function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

type Bounds = {
  w: number;
  h: number;
  btnW: number;
  btnH: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

type BgHeart = {
  id: string;
  left: string;
  top: string;
  size: string;
  opacity: number;
  delay: string;
  dur: string;
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

export default function ValentineQuestion() {
  const router = useRouter();

  const arenaRef = useRef<HTMLDivElement | null>(null);
  const noAbsRef = useRef<HTMLButtonElement | null>(null);

  const [released, setReleased] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [mountedNo, setMountedNo] = useState(false);

  // ✅ fix hydration mismatch: create bg hearts only after mount
  const [bgHearts, setBgHearts] = useState<BgHeart[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);

  const lastMoveAtRef = useRef<number>(0);
  const movingRef = useRef<boolean>(false);

  const lines = useMemo(
    () => ["Dili ko musugot! 😈", "Akoa raka 💗", "Naay gamay 😳", "Bahala ka! 😄", "Ambot 😅"],
    []
  );
  const [noText, setNoText] = useState<string>("No 😅");
  const rotateNoLine = useCallback(() => {
    setNoText(lines[Math.floor(Math.random() * lines.length)]);
  }, [lines]);

  const heartColors = useMemo(
    () => ["rgba(255,54,120,0.92)", "rgba(255,110,170,0.92)", "rgba(255,140,195,0.90)", "rgba(255,86,150,0.90)"],
    []
  );

  useEffect(() => {
    // ✅ create floating background hearts AFTER mount (client-only)
    const hearts: BgHeart[] = Array.from({ length: 22 }).map((_, i) => ({
      id: `h${i}-${uid()}`,
      left: `${Math.round(rand(0, 100))}%`,
      top: `${Math.round(rand(0, 100))}%`,
      size: `${Math.round(rand(10, 22))}px`,
      opacity: 0.07 + (i % 5) * 0.02,
      delay: `${Math.round(rand(0, 2400))}ms`,
      dur: `${Math.round(rand(5200, 9000))}ms`,
    }));
    setBgHearts(hearts);
  }, []);

  const getBounds = useCallback((): Bounds | null => {
    const arena = arenaRef.current;
    const noBtn = noAbsRef.current;
    if (!arena) return null;

    const ar = arena.getBoundingClientRect();
    const br = noBtn?.getBoundingClientRect();

    const btnW = br?.width && br.width > 0 ? br.width : 160;
    const btnH = br?.height && br.height > 0 ? br.height : 44;

    const w = ar.width;
    const h = ar.height;

    const pad = clamp(Math.round(Math.min(w, h) * 0.085), 14, 46);

    const minX = pad;
    const minY = pad;
    const maxX = Math.max(minX, w - btnW - pad);
    const maxY = Math.max(minY, h - btnH - pad);

    return { w, h, btnW, btnH, minX, maxX, minY, maxY };
  }, []);

  const setMovingFor = (ms: number) => {
    movingRef.current = true;
    window.setTimeout(() => {
      movingRef.current = false;
    }, ms);
  };

  const dodge = useCallback(
    (avoidX?: number, avoidY?: number) => {
      const arena = arenaRef.current;
      const b = getBounds();
      if (!arena || !b) return;

      const now = Date.now();
      const cooldown = 220;
      if (now - lastMoveAtRef.current < cooldown) return;
      if (movingRef.current) return;

      const firstEscape = !released;
      if (firstEscape) setReleased(true);

      rotateNoLine();

      let next = { x: b.minX, y: b.minY };
      if (firstEscape) {
        const topZoneMax = clamp(b.maxY * 0.45, b.minY, b.maxY);
        next = { x: rand(b.minX, b.maxX), y: rand(b.minY, topZoneMax) };
      } else {
        let best = { x: b.minX, y: b.minY };
        let bestDist = -1;

        for (let i = 0; i < 26; i++) {
          const x = rand(b.minX, b.maxX);
          const y = rand(b.minY, b.maxY);

          if (avoidX == null || avoidY == null) {
            best = { x, y };
            break;
          }

          const cx = x + b.btnW / 2;
          const cy = y + b.btnH / 2;
          const dist = Math.hypot(cx - avoidX, cy - avoidY);
          if (dist > bestDist) {
            bestDist = dist;
            best = { x, y };
          }
        }
        next = best;
      }

      lastMoveAtRef.current = now;
      setMovingFor(260);

      setPos(next);
      setMountedNo(true);
    },
    [getBounds, released, rotateNoLine]
  );

  useLayoutEffect(() => {
    if (!released) return;
    const raf = requestAnimationFrame(() => dodge());
    return () => cancelAnimationFrame(raf);
  }, [released, dodge]);

  useEffect(() => {
    const onResize = () => {
      if (!released) return;
      const b = getBounds();
      if (!b) return;
      setPos((p) => ({
        x: clamp(p.x, b.minX, b.maxX),
        y: clamp(p.y, b.minY, b.maxY),
      }));
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [released, getBounds]);

  const onArenaPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!released) return;
      const arena = arenaRef.current;
      const b = getBounds();
      if (!arena || !b) return;

      const ar = arena.getBoundingClientRect();
      const px = e.clientX - ar.left;
      const py = e.clientY - ar.top;

      const cx = pos.x + b.btnW / 2;
      const cy = pos.y + b.btnH / 2;

      const danger = clamp(Math.max(b.btnW, b.btnH) * 1.08, 85, 220);
      const dist = Math.hypot(px - cx, py - cy);

      if (dist < danger) dodge(px, py);
    },
    [released, dodge, getBounds, pos.x, pos.y]
  );

  const spawnBurst = useCallback(
    (clientX: number, clientY: number) => {
      const el = arenaRef.current;
      if (!el) return;

      const r = el.getBoundingClientRect();
      const x = ((clientX - r.left) / r.width) * 100;
      const y = ((clientY - r.top) / r.height) * 100;

      const batch: Burst[] = Array.from({ length: 12 }).map((_, i) => ({
        id: uid() + ":" + i,
        x,
        y,
        dx: `${Math.round(rand(-70, 70))}px`,
        dy: `${Math.round(rand(-120, -35))}px`,
        r: `${Math.round(rand(-25, 25))}deg`,
        s: `${rand(0.85, 1.25).toFixed(2)}`,
        heart: heartColors[Math.floor(Math.random() * heartColors.length)],
        delay: Math.round(rand(0, 120)),
      }));

      setBursts((prev) => [...prev, ...batch]);
      window.setTimeout(() => setBursts((prev) => prev.slice(batch.length)), 1100);
    },
    [heartColors]
  );

  const onNoDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const arena = arenaRef.current;
      if (!arena) return;
      const ar = arena.getBoundingClientRect();
      dodge(e.clientX - ar.left, e.clientY - ar.top);
    },
    [dodge]
  );

  return (
    <div className={styles.scene}>
      <div className={styles.bg} aria-hidden />
      <div className={styles.grain} aria-hidden />

      {/* ✅ moving hearts (client-generated, no hydration mismatch) */}
      <div className={styles.pageHearts} aria-hidden>
        {bgHearts.map((h) => (
          <span
            key={h.id}
            className={styles.pageHeart}
            style={{
              left: h.left,
              top: h.top,
              width: h.size,
              height: h.size,
              opacity: h.opacity,
              animationDelay: h.delay,
              animationDuration: h.dur,
            }}
          />
        ))}
      </div>

      <main className={styles.card}>
        <div className={styles.badge}>💖 Valentine Invite</div>
        <h1 className={styles.title}>Joella</h1>
        <p className={styles.subtitle}>Will you be my Valentine’s date? 💌</p>

        <div
          ref={arenaRef}
          className={styles.arena}
          onPointerMove={onArenaPointerMove}
          onPointerDown={(e) => spawnBurst(e.clientX, e.clientY)}
        >
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

          <div className={styles.actions}>
            <button className={`${styles.btn} ${styles.btnYes}`} onClick={() => router.push("/surprise")}>
              Yes 💞
            </button>

            {!released ? (
              <button
                className={`${styles.btn} ${styles.btnNo}`}
                onPointerEnter={(e) => onNoDown(e)}
                onPointerDown={(e) => {
                  e.preventDefault();
                  onNoDown(e);
                }}
                onClick={(e) => e.preventDefault()}
                title="Try to click 😄"
              >
                {noText}
              </button>
            ) : (
              <div className={styles.noPlaceholder} aria-hidden />
            )}
          </div>

          {released && (
            <button
              ref={noAbsRef}
              className={`${styles.btn} ${styles.btnNo} ${styles.noMove}`}
              style={{
                transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
                opacity: mountedNo ? 1 : 0,
                pointerEvents: mountedNo ? "auto" : "none",
              }}
              onPointerEnter={() => dodge()}
              onPointerDown={(e) => {
                e.preventDefault();
                onNoDown(e);
              }}
              onClick={(e) => {
                e.preventDefault();
                dodge();
              }}
              title="Try to click 😄"
            >
              {noText}
            </button>
          )}

          <p className={styles.hint}>(Tap anywhere for hearts ✨)</p>
        </div>

        <div className={styles.footer}>
          <span className={styles.line} />
          <span className={styles.from}>From: Jhoma Go</span>
          <span className={styles.line} />
        </div>
      </main>
    </div>
  );
}
