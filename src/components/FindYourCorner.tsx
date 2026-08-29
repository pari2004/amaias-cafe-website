"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { IMG, type Img } from "@/lib/images";
import { EASE, useCalm } from "@/components/ui/motion";
import { Grain, Steam, Vignette } from "@/components/ui/Atmosphere";

/**
 * SECTION 4 — Find Your Corner.
 * Motion language: *stacked cinema*. Each scene slides up over the one
 * before it while the image inside counter-travels, so the incoming frame
 * has real depth rather than sliding as a flat card. The outgoing scene
 * simultaneously recedes and dims. Transform-only, so it stays on the
 * compositor.
 */

type Scene = { img: Img; line: string; sub: string };

const SCENES: Scene[] = [
  { img: IMG.scene1, line: "Slow Mornings.", sub: "The first filter coffee of the day, still too hot to drink." },
  { img: IMG.scene2, line: "Good Conversations.", sub: "A plate between two people and nowhere else to be." },
  { img: IMG.scene3, line: "Coffee Breaks.", sub: "Fifteen minutes that belong entirely to you." },
  { img: IMG.scene4, line: "Work & Relax.", sub: "Laptop open, fries arriving, deadline slightly further away." },
  { img: IMG.scene5, line: "Your Favourite Corner.", sub: "The seat you start choosing without thinking about it." },
];

const N = SCENES.length;

function Layer({
  scene,
  i,
  p,
  calm,
}: {
  scene: Scene;
  i: number;
  p: MotionValue<number>;
  calm: boolean;
}) {
  // All input ranges are kept inside [0, 1] — framer-motion accelerates
  // scroll-linked values through WAAPI, which rejects offsets outside it.
  const first = i === 0;
  const last = i === N - 1;
  const seg = 1 / N;
  const enterFrom = first ? 0 : i * seg;
  const enterTo = first ? 1 : Math.min(1, enterFrom + seg * 0.62);
  const exitFrom = last ? 0 : Math.min((i + 1) * seg, 0.998);
  const exitTo = last ? 1 : Math.min(exitFrom + seg * 0.62, 1);

  // Arrival: the whole scene slides up over the stack.
  const y = useTransform(
    p,
    [enterFrom, enterTo],
    first || calm ? ["0%", "0%"] : ["100%", "0%"]
  );

  // The image counter-travels inside its frame, then keeps drifting.
  const innerY = useTransform(
    p,
    [enterFrom, enterTo, exitTo],
    calm ? ["0%", "0%", "0%"] : first ? ["0%", "0%", "-9%"] : ["-26%", "0%", "-9%"]
  );

  // Departure: recede behind the incoming scene. The final scene never leaves.
  const scale = useTransform(p, [exitFrom, exitTo], last || calm ? [1, 1] : [1, 0.9]);
  const dim = useTransform(p, [exitFrom, exitTo], last ? [0, 0] : [0, 0.72]);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden will-change-transform"
      style={{ y, zIndex: i + 1 }}
    >
      <motion.div className="absolute inset-0" style={{ scale }}>
        <motion.div className="absolute -inset-y-[14%] inset-x-0" style={{ y: innerY }}>
          <Image
            src={scene.img.src}
            alt={scene.img.alt}
            fill
            sizes="100vw"
            placeholder="blur"
            blurDataURL={scene.img.blurDataURL}
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/55" />
        <motion.div className="absolute inset-0 bg-ink" style={{ opacity: dim }} />
      </motion.div>
    </motion.div>
  );
}

export default function FindYourCorner() {
  const wrap = useRef<HTMLElement>(null);
  const calm = useCalm();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.floor(v * N + 0.38)));
    setActive((prev) => (prev === i ? prev : i));
  });

  const railScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={wrap}
      id="experience"
      className="relative z-10 bg-ink"
      style={{ height: `${(N + 0.6) * 100}svh` }}
      aria-label="Find your corner"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {SCENES.map((s, i) => (
          <Layer key={s.line} scene={s} i={i} p={scrollYProgress} calm={calm} />
        ))}

        <div className="pointer-events-none absolute inset-0" style={{ zIndex: N + 2 }}>
          <Steam count={4} height={300} peak={0.16} seed={41} />
          <Vignette strength={0.72} />
          <Grain />
        </div>

        {/* ---------- overlay: heading + storytelling lines ---------- */}
        <div
          className="pointer-events-none absolute inset-0 mx-auto flex h-full max-w-[1400px] flex-col justify-between px-6 py-24 md:px-12 md:py-28"
          style={{ zIndex: N + 3 }}
        >
          <div>
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE }}
            >
              The Experience
            </motion.p>
            <motion.h2
              className="display-md mt-4 font-display text-cream"
              initial={calm ? { opacity: 0 } : { opacity: 0, y: 26, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: EASE }}
            >
              Find Your Corner.
            </motion.h2>
          </div>

          {/* the line that changes with the scene */}
          <div className="relative h-40 md:h-48">
            {SCENES.map((s, i) => (
              <motion.div
                key={s.line}
                className="absolute inset-x-0 bottom-0"
                initial={false}
                animate={
                  active === i
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : { opacity: 0, y: active > i ? -40 : 40, filter: "blur(8px)" }
                }
                transition={{ duration: calm ? 0.2 : 0.85, ease: EASE }}
                aria-hidden={active !== i}
              >
                <span className="block font-mono text-[0.62rem] tracking-[0.32em] text-amber/75">
                  {String(i + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
                </span>
                <p className="mt-3 max-w-4xl font-display text-[2.4rem] leading-[1.02] text-cream md:text-[4.5rem]">
                  {s.line}
                </p>
                <p className="mt-4 max-w-md text-sm text-linen/65 md:text-base">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ---------- vertical progress rail ---------- */}
        <div
          className="pointer-events-none absolute right-5 top-1/2 hidden h-40 w-px -translate-y-1/2 bg-linen/15 md:block"
          style={{ zIndex: N + 3 }}
          aria-hidden
        >
          <motion.span
            className="absolute inset-x-0 top-0 block h-full origin-top bg-amber"
            style={{ scaleY: railScaleY }}
          />
        </div>
      </div>
    </section>
  );
}
