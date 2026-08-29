"use client";

import { useEffect, useRef } from "react";

/**
 * A warm, slow-drifting mote field — roasted-dust and soft bokeh rising
 * through the hero. Canvas rather than DOM so the particle count stays
 * free; the loop parks itself when off-screen, on a hidden tab, or when
 * the visitor prefers reduced motion.
 */

type Mote = {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  phase: number;
  a: number;
  hue: string;
};

const HUES = [
  "224, 172, 110", // amber
  "192, 138, 78", // caramel
  "246, 241, 232", // cream
  "165, 100, 58", // ember
];

export default function CoffeeParticles({
  className = "",
  density = 1,
}: {
  className?: string;
  density?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    let w = 0;
    let h = 0;
    let motes: Mote[] = [];
    let raf = 0;
    let visible = true;
    let last = performance.now();

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const base = w < 720 ? 26 : 52;
      const n = Math.round(base * density);
      motes = Array.from({ length: n }, () => {
        const big = Math.random() > 0.86;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: big ? 9 + Math.random() * 22 : 0.7 + Math.random() * 2.1,
          vy: (big ? 4 : 10 + Math.random() * 18) * (0.5 + Math.random()),
          sway: 8 + Math.random() * 26,
          phase: Math.random() * Math.PI * 2,
          a: big ? 0.035 + Math.random() * 0.05 : 0.12 + Math.random() * 0.4,
          hue: HUES[Math.floor(Math.random() * HUES.length)],
        };
      });
    };

    const draw = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      ctx.clearRect(0, 0, w, h);

      for (const m of motes) {
        m.y -= m.vy * dt;
        m.phase += dt * 0.5;
        if (m.y < -m.r * 2) {
          m.y = h + m.r * 2;
          m.x = Math.random() * w;
        }
        const x = m.x + Math.sin(m.phase) * m.sway;

        if (m.r > 6) {
          const g = ctx.createRadialGradient(x, m.y, 0, x, m.y, m.r);
          g.addColorStop(0, `rgba(${m.hue}, ${m.a})`);
          g.addColorStop(1, `rgba(${m.hue}, 0)`);
          ctx.fillStyle = g;
        } else {
          ctx.fillStyle = `rgba(${m.hue}, ${m.a})`;
        }
        ctx.beginPath();
        ctx.arc(x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (visible) raf = requestAnimationFrame(draw);
    };

    const paintStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        ctx.fillStyle = `rgba(${m.hue}, ${m.a * 0.6})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const start = () => {
      if (calm || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    build();
    if (calm) {
      paintStatic();
    } else {
      start();
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVis = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVis);

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        if (calm) paintStatic();
      }, 180);
    });
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
    />
  );
}
