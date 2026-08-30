"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { IMG } from "@/lib/images";
import { EASE, RevealLines, WordsIn, useCalm } from "@/components/ui/motion";
import { Bloom, Grain, Leaves } from "@/components/ui/Atmosphere";

/**
 * SECTION 5 — A Little Escape in the City.
 * Motion language: *breathing*. Nothing snaps. Three depths of line-drawn
 * foliage drift at different rates, leaves fall the full height of the
 * section, and the copy arrives word by word. This is the exhale after
 * the stacked-cinema sequence.
 *
 * The café has no greenery photography, so the foliage here is drawn
 * rather than photographed — line-art fronds in sage and fern.
 */

function Frond({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 320"
      fill="none"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden
    >
      <path
        d="M100 320C100 220 92 130 62 40"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {Array.from({ length: 9 }).map((_, i) => {
        const t = i / 8;
        const y = 300 - t * 250;
        const x = 100 - t * 34;
        const len = 76 * (1 - t * 0.55) + 16;
        return (
          <g key={i}>
            <path
              d={`M${x} ${y} C ${x + len * 0.4} ${y - 18}, ${x + len * 0.8} ${y - 26}, ${x + len} ${y - 40}`}
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d={`M${x} ${y} C ${x - len * 0.4} ${y - 18}, ${x - len * 0.8} ${y - 26}, ${x - len} ${y - 40}`}
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </svg>
  );
}

function Monstera({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 240" fill="none" className={className} aria-hidden>
      <path
        d="M120 232C120 232 22 196 22 112 22 52 68 12 120 12s98 40 98 100c0 84-98 120-98 120Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M120 232V26" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {[0.22, 0.42, 0.62, 0.8].map((t, i) => (
        <g key={i}>
          <path
            d={`M120 ${232 - t * 190} L ${120 - (78 - t * 30)} ${232 - t * 190 - 26}`}
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d={`M120 ${232 - t * 190} L ${120 + (78 - t * 30)} ${232 - t * 190 - 26}`}
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </g>
      ))}
    </svg>
  );
}

export default function GreenEscape() {
  const section = useRef<HTMLElement>(null);
  const calm = useCalm();

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  });

  const backY = useTransform(scrollYProgress, [0, 1], calm ? [0, 0] : [70, -70]);
  const midY = useTransform(scrollYProgress, [0, 1], calm ? [0, 0] : [130, -130]);
  const frontY = useTransform(scrollYProgress, [0, 1], calm ? [0, 0] : [210, -210]);
  const textY = useTransform(scrollYProgress, [0, 1], calm ? [0, 0] : [40, -40]);
  const textureScale = useTransform(scrollYProgress, [0, 1], calm ? [1, 1] : [1.12, 1]);

  return (
    <section
      ref={section}
      className="relative z-10 overflow-hidden bg-moss py-32 md:py-48"
      aria-label="A little escape in the city"
    >
      {/* ground */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 30% 20%, #4a5c41 0%, #3a4a34 42%, #26301f 100%)",
        }}
      />
      <motion.div className="absolute inset-0 opacity-[0.13] mix-blend-overlay" style={{ scale: textureScale }}>
        <Image
          src={IMG.green.src}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={IMG.green.blurDataURL}
          className="object-cover"
        />
      </motion.div>

      <Bloom color="#93a484" size={620} opacity={0.16} top="-16%" left="8%" duration={48} />
      <Bloom color="#c08a4e" size={420} opacity={0.10} bottom="-8%" right="4%" duration={54} delay={-16} />

      {/* --- foliage, three depths --- */}
      <motion.div style={{ y: backY }} className="pointer-events-none absolute inset-0 text-sage/[0.14]">
        <Monstera className="absolute -left-16 top-4 w-56 rotate-12 md:w-80" />
        <Frond className="absolute -right-10 top-0 w-48 -rotate-12 md:w-72" flip />
      </motion.div>

      <motion.div style={{ y: midY }} className="pointer-events-none absolute inset-0 text-sage/[0.2]">
        <Frond className="absolute -left-20 bottom-[-4rem] w-64 rotate-[18deg] md:w-96" />
        <Monstera className="absolute -right-16 bottom-8 w-52 -rotate-[14deg] md:w-72" />
      </motion.div>

      <motion.div style={{ y: frontY }} className="pointer-events-none absolute inset-0 text-fern/30">
        <Frond className="absolute -left-28 bottom-[-8rem] w-80 rotate-[26deg] blur-[1px] md:w-[30rem]" flip />
        <Frond className="absolute -right-24 top-[-6rem] w-72 rotate-[200deg] blur-[1px] md:w-[26rem]" />
      </motion.div>

      <Leaves count={calm ? 6 : 16} seed={5} />
      <Grain />

      {/* seams — the green should arrive and leave, not cut */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink to-transparent md:h-44"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent md:h-44"
        aria-hidden
      />

      {/* --- copy --- */}
      <motion.div
        style={{ y: textY }}
        className="relative mx-auto max-w-[1400px] px-6 text-center md:px-12"
      >
        <motion.p
          className="mb-6 text-[0.68rem] tracking-[0.34em] text-sage/70 md:text-xs"
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.34em" }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          A QUIETER FREQUENCY
        </motion.p>

        <h2 className="display-lg mx-auto max-w-4xl font-display text-cream">
          <RevealLines
            lines={[<>A Little Escape </>, <>in the <em className="not-italic text-sage">City.</em></>]}
            stagger={0.14}
          />
        </h2>

        <div className="mx-auto mt-10 max-w-xl md:mt-12">
          <WordsIn
            className="text-base leading-loose text-linen/75 md:text-xl"
            text="Step away from the noise and settle into a space filled with warmth, greenery, good coffee, and good energy."
            delay={0.3}
            stagger={0.035}
          />
        </div>

        <motion.div
          className="mx-auto mt-14 h-16 w-px origin-top bg-gradient-to-b from-sage/60 to-transparent"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.6, ease: EASE }}
          aria-hidden
        />
      </motion.div>
    </section>
  );
}
