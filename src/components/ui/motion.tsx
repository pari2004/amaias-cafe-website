"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------
   Shared easing + a single source of truth for motion preferences.
   ------------------------------------------------------------------ */

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_SOFT = [0.65, 0, 0.35, 1] as const;

/**
 * True when the visitor has asked for reduced motion.
 *
 * The value is deliberately `false` for the server render *and* the first
 * client render, then flips after mount. Branching on the media query
 * during hydration would emit different `initial` props on the two passes
 * and blow up the whole tree with a hydration mismatch — which is exactly
 * the audience least able to absorb a full client re-render.
 */
export function useCalm() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && (reduced ?? false);
}

/**
 * Watch an element and report the first time it is on screen.
 *
 * Use this — not `whileInView` — whenever the thing being revealed hides
 * itself by clipping (a mask wipe, a line sliding up behind
 * `overflow-hidden`). Such an element reports an intersection ratio of
 * zero while hidden, so a `whileInView` threshold placed on it can never
 * be met and the reveal deadlocks. Observing an unclipped wrapper instead
 * breaks the cycle.
 */
export function useSeen<T extends HTMLElement = HTMLDivElement>(
  amount: number | "some" | "all" = 0.3,
  once = true
) {
  const ref = useRef<T>(null);
  const seen = useInView(ref, { once, amount });
  return [ref, seen] as const;
}

/* ------------------------------------------------------------------
   Reveal — the workhorse enter animation.
   ------------------------------------------------------------------ */

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  once?: boolean;
  amount?: number;
  as?: "div" | "span" | "li" | "figure" | "section";
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  blur = true,
  once = true,
  amount = 0.35,
}: RevealProps) {
  const calm = useCalm();
  return (
    <motion.div
      className={className}
      initial={
        calm
          ? { opacity: 0 }
          : { opacity: 0, y, filter: blur ? "blur(10px)" : "blur(0px)" }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount }}
      transition={{ duration: calm ? 0.3 : 1.05, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------
   RevealLines — headline text that unmasks line by line.
   Each line is clipped by an overflow-hidden parent and slid up.
   ------------------------------------------------------------------ */

export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  once = true,
  amount = 0.3,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
}) {
  const calm = useCalm();
  // The observer sits on the unclipped outer span: each line is parked
  // below an overflow-hidden mask and reports zero intersection until it
  // has already arrived.
  const [ref, seen] = useSeen<HTMLSpanElement>(amount, once);

  const hidden = calm
    ? { opacity: 0 }
    : { opacity: 0, y: "108%", rotate: 1.5 };
  const shown = { opacity: 1, y: "0%", rotate: 0 };

  return (
    <span ref={ref} className={`block ${className ?? ""}`}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            initial={hidden}
            animate={seen ? shown : hidden}
            transition={{
              duration: calm ? 0.3 : 1.15,
              delay: delay + i * stagger,
              ease: EASE,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------
   WordsIn — softer per-word entrance for body copy.
   ------------------------------------------------------------------ */

export function WordsIn({
  text,
  className,
  delay = 0,
  stagger = 0.024,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const calm = useCalm();
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="inline-block whitespace-pre"
          initial={calm ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: calm ? 0.25 : 0.75,
            delay: delay + i * stagger,
            ease: EASE,
          }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------
   Counter — springs a number upward the first time it is seen.
   ------------------------------------------------------------------ */

export function Counter({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.9,
  className,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const calm = useCalm();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, {
    stiffness: 42,
    damping: 22,
    restDelta: 0.001,
    duration,
  });

  useEffect(() => {
    if (!inView) return;
    if (calm) {
      mv.set(to);
      return;
    }
    mv.set(to);
  }, [inView, to, mv, calm]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const write = (v: number) => {
      el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
    };
    write(calm && inView ? to : 0);
    if (calm) return;
    return spring.on("change", write);
  }, [spring, decimals, prefix, suffix, calm, inView, to]);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${to}${suffix}`}>
      {prefix}
      {(0).toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------
   Parallax helper — turns a 0..1 progress value into px drift,
   flattened to 0 when the user prefers reduced motion.
   ------------------------------------------------------------------ */

export function useParallax(
  progress: MotionValue<number>,
  distance: number,
  calm: boolean
) {
  return useTransform(progress, [0, 1], calm ? [0, 0] : [distance, -distance]);
}

export { motion };
