"use client";

import { useMemo } from "react";

/* ------------------------------------------------------------------
   Steam — a cluster of drifting wisps. Pure CSS, GPU-only properties.
   Deterministic values (seeded) so SSR and client markup match.
   ------------------------------------------------------------------ */

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

export function Steam({
  count = 6,
  className = "",
  height = 220,
  peak = 0.45,
  seed = 7,
}: {
  count?: number;
  className?: string;
  height?: number;
  peak?: number;
  seed?: number;
}) {
  const wisps = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, (_, i) => ({
      left: 12 + r() * 76,
      dur: 6.5 + r() * 5.5,
      delay: -(r() * 9),
      drift: 10 + r() * 26,
      h: height * (0.65 + r() * 0.5),
      w: 1.5 + r() * 2.5,
      peak: peak * (0.6 + r() * 0.6),
      key: i,
    }));
  }, [count, height, peak, seed]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {wisps.map((w) => (
        <span
          key={w.key}
          className="steam-wisp"
          style={
            {
              left: `${w.left}%`,
              height: `${w.h}px`,
              width: `${w.w}px`,
              "--steam-dur": `${w.dur}s`,
              "--steam-delay": `${w.delay}s`,
              "--steam-drift": `${w.drift}px`,
              "--steam-peak": w.peak,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   Grain — animated film grain overlay.
   ------------------------------------------------------------------ */

export function Grain({ className = "", opacity }: { className?: string; opacity?: number }) {
  return (
    <div
      className={`grain pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={opacity !== undefined ? ({ "--grain-op": opacity } as React.CSSProperties) : undefined}
      aria-hidden
    />
  );
}

/* ------------------------------------------------------------------
   Vignette — cinematic edge falloff.
   ------------------------------------------------------------------ */

export function Vignette({ strength = 0.75 }: { strength?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden
      style={{
        background: `radial-gradient(120% 90% at 50% 45%, transparent 35%, rgba(10,7,6,${
          strength * 0.55
        }) 72%, rgba(10,7,6,${strength}) 100%)`,
      }}
    />
  );
}

/* ------------------------------------------------------------------
   Leaves — slow falling foliage for the Green Escape section.
   ------------------------------------------------------------------ */

const LEAF_PATH =
  "M12 1C6.5 4 2 8.6 2 14.2 2 19 5.6 23 10.4 23c5.6 0 10.2-4.6 11.6-11.5C22.6 7 18.4 2.6 12 1Zm-.6 4.6c.4 5.6-1.4 10.6-5 14.6";

export function Leaves({ count = 14, seed = 3 }: { count?: number; seed?: number }) {
  const leaves = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, (_, i) => ({
      key: i,
      left: r() * 100,
      size: 12 + r() * 24,
      dur: 17 + r() * 20,
      delay: -(r() * 30),
      x: (r() - 0.5) * 320,
      spin: 180 + r() * 540,
      op: 0.16 + r() * 0.3,
      hue: r() > 0.5 ? "var(--color-sage)" : "var(--color-fern)",
    }));
  }, [count, seed]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {leaves.map((l) => (
        <svg
          key={l.key}
          className="leaf"
          viewBox="0 0 24 24"
          fill="none"
          stroke={l.hue}
          strokeWidth={1.2}
          strokeLinecap="round"
          style={
            {
              left: `${l.left}%`,
              width: `${l.size}px`,
              height: `${l.size}px`,
              "--leaf-dur": `${l.dur}s`,
              "--leaf-delay": `${l.delay}s`,
              "--leaf-x": `${l.x}px`,
              "--leaf-spin": `${l.spin}deg`,
              "--leaf-op": l.op,
            } as React.CSSProperties
          }
        >
          <path d={LEAF_PATH} />
        </svg>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   Bloom — soft drifting light pools.
   ------------------------------------------------------------------ */

export function Bloom({
  color = "var(--color-caramel)",
  size = 520,
  opacity = 0.16,
  top,
  left,
  right,
  bottom,
  duration = 26,
  delay = 0,
}: {
  color?: string;
  size?: number;
  opacity?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  duration?: number;
  delay?: number;
}) {
  return (
    <div
      className="bloom"
      aria-hidden
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        background: color,
        opacity,
        animation: `bloom-drift ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}
