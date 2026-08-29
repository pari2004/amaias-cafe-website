"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { IMG } from "@/lib/images";
import { SITE } from "@/lib/site";
import { EASE, useCalm } from "@/components/ui/motion";
import { Bloom, Grain, Steam, Vignette } from "@/components/ui/Atmosphere";
import CoffeeParticles from "@/components/ui/CoffeeParticles";

/**
 * HERO — a *built* scene, not a photograph.
 *
 * The café has no ambience/interior/exterior photography in the project,
 * so rather than putting a price-list poster on the front page we compose
 * the atmosphere: a deep roast gradient ground, drifting light pools, a
 * slowly turning crema swirl, a rising mote field, steam, and grain.
 * One heavily-graded coffee texture sits far back at low opacity purely
 * as depth — it never reads as a product shot.
 *
 * Scrolling away is choreographed rather than faded: the ground scales and
 * sinks, the swirl counter-rotates, and the three text layers leave at
 * three different speeds, so the first scroll has a sense of depth.
 */

export default function Hero() {
  const wrap = useRef<HTMLDivElement>(null);
  const calm = useCalm();

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end start"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });

  const flat = (a: number, b: number) => (calm ? [a, a] : [a, b]);

  // Ground: scales up and sinks as you leave.
  const bgScale = useTransform(p, [0, 1], flat(1.04, 1.32));
  const bgY = useTransform(p, [0, 1], calm ? ["0%", "0%"] : ["0%", "9%"]);
  const bgBlur = useTransform(p, [0, 1], flat(0, 9));
  const bgFilter = useTransform(bgBlur, (v) => `blur(${v}px) brightness(${1 - v * 0.045})`);

  // Swirl counter-rotates against the ground.
  const swirlRotate = useTransform(p, [0, 1], flat(0, -55));
  const swirlScale = useTransform(p, [0, 1], flat(1, 1.5));

  // Three text layers, three speeds.
  const titleY = useTransform(p, [0, 1], calm ? ["0%", "0%"] : ["0%", "-190%"]);
  const titleOpacity = useTransform(p, [0, 0.55], flat(1, 0));
  const subY = useTransform(p, [0, 1], calm ? ["0%", "0%"] : ["0%", "-120%"]);
  const subOpacity = useTransform(p, [0, 0.42], flat(1, 0));
  const ctaY = useTransform(p, [0, 1], calm ? ["0%", "0%"] : ["0%", "-60%"]);
  const ctaOpacity = useTransform(p, [0, 0.35], flat(1, 0));
  const cueOpacity = useTransform(p, [0, 0.18], flat(1, 0));

  // A warm horizon that swells at the bottom edge as the next scene arrives.
  const horizonOpacity = useTransform(p, [0.15, 1], flat(0, 0.85));
  const horizonScale = useTransform(p, [0.15, 1], flat(0.6, 1.6));

  return (
    <div ref={wrap} id="top" className="relative h-[142svh]">
      <section
        className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink"
        aria-label="Amaia's Coffee House — welcome"
      >
        {/* ---------- Layer 1 · roast ground ---------- */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale: bgScale, y: bgY, filter: bgFilter }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(115% 85% at 50% 82%, #3a2415 0%, #201710 34%, #0f0b09 68%, #070505 100%)",
            }}
          />

          {/* far-back coffee texture — depth only, heavily graded and masked */}
          <Image
            src={IMG.heroAtmos.src}
            alt=""
            fill
            preload
            quality={70}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={IMG.heroAtmos.blurDataURL}
            className="object-cover opacity-[0.30] mix-blend-luminosity"
            style={{ maskImage: "radial-gradient(85% 70% at 50% 58%, #000 10%, transparent 78%)", WebkitMaskImage: "radial-gradient(85% 70% at 50% 58%, #000 10%, transparent 78%)" }}
          />

          {/* drifting light pools */}
          <Bloom color="#c08a4e" size={620} opacity={0.17} top="-12%" left="-8%" duration={30} />
          <Bloom color="#e0aa6b" size={480} opacity={0.13} bottom="-14%" right="-6%" duration={38} delay={-9} />
          <Bloom color="#a5643a" size={720} opacity={0.10} top="30%" left="42%" duration={46} delay={-18} />
        </motion.div>

        {/* ---------- Layer 2 · crema swirl ---------- */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[135vmax] -translate-x-1/2 -translate-y-1/2 will-change-transform"
          style={{ rotate: swirlRotate, scale: swirlScale }}
          aria-hidden
        >
          <div
            className="absolute inset-0 rounded-full opacity-[0.20]"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(224,170,107,0.32) 42deg, transparent 96deg, rgba(192,138,78,0.22) 168deg, transparent 232deg, rgba(224,170,107,0.26) 300deg, transparent 360deg)",
              maskImage: "radial-gradient(closest-side, transparent 38%, #000 56%, #000 74%, transparent 88%)",
              WebkitMaskImage: "radial-gradient(closest-side, transparent 38%, #000 56%, #000 74%, transparent 88%)",
              animation: calm ? "none" : "slow-spin 90s linear infinite",
            }}
          />
          <div
            className="absolute inset-[14%] rounded-full opacity-[0.13]"
            style={{
              background:
                "conic-gradient(from 180deg, transparent, rgba(246,241,232,0.30) 70deg, transparent 150deg, rgba(192,138,78,0.28) 250deg, transparent 340deg)",
              maskImage: "radial-gradient(closest-side, transparent 46%, #000 62%, transparent 84%)",
              WebkitMaskImage: "radial-gradient(closest-side, transparent 46%, #000 62%, transparent 84%)",
              animation: calm ? "none" : "slow-spin 64s linear infinite reverse",
            }}
          />
        </motion.div>

        {/* ---------- Layer 3 · motes + steam ---------- */}
        <CoffeeParticles className="opacity-90" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%]">
          <Steam count={7} height={380} peak={0.30} seed={11} />
        </div>

        <Vignette strength={0.82} />

        {/* ---------- Layer 4 · content ---------- */}
        <div className="relative z-20 mx-auto flex h-full max-w-[1400px] flex-col items-center justify-center px-6 text-center md:px-12">
          <motion.p
            initial={{ opacity: 0, y: 14, letterSpacing: "0.55em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.32em" }}
            transition={{ duration: 1.4, delay: 0.15, ease: EASE }}
            className="eyebrow mb-7 md:mb-9"
          >
            BTM Layout · Bengaluru
          </motion.p>

          <motion.h1
            style={{ y: titleY, opacity: titleOpacity }}
            className="display-xl font-display text-cream will-change-transform"
          >
            {["Coffee.", "Comfort.", "Conversations."].map((word, i) => (
              <span key={word} className="block overflow-hidden pb-[0.06em] -mb-[0.06em] md:inline md:pb-0 md:-mb-0">
                <motion.span
                  className="block md:inline-block"
                  initial={calm ? { opacity: 0 } : { opacity: 0, y: "110%", rotate: 2 }}
                  animate={{ opacity: 1, y: "0%", rotate: 0 }}
                  transition={{ duration: calm ? 0.4 : 1.5, delay: 0.3 + i * 0.13, ease: EASE }}
                >
                  <span
                    className={
                      i === 2
                        ? "bg-gradient-to-br from-amber via-cream to-caramel bg-clip-text italic text-transparent"
                        : undefined
                    }
                  >
                    {word}
                  </span>
                  {i < 2 && <span className="hidden md:inline">&nbsp;</span>}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.p
            style={{ y: subY, opacity: subOpacity }}
            className="mt-8 max-w-xl text-balance text-base font-light leading-relaxed text-linen/75 will-change-transform md:mt-10 md:text-xl"
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, delay: 0.85, ease: EASE }}
            >
              A cozy corner in Bengaluru where every cup feels like home.
            </motion.span>
          </motion.p>

          <motion.div
            style={{ y: ctaY, opacity: ctaOpacity }}
            className="mt-11 flex w-full flex-col items-center gap-3.5 will-change-transform sm:w-auto sm:flex-row sm:gap-4 md:mt-14"
          >
            <motion.a
              href="#story"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.05, ease: EASE }}
              className="group relative w-full overflow-hidden rounded-full bg-cream px-9 py-4 text-sm font-medium tracking-wide text-ink transition-transform duration-500 hover:scale-[1.03] active:scale-[0.99] sm:w-auto"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-full" />
              <span className="relative">Explore the Experience</span>
            </motion.a>

            <motion.a
              href="#visit"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.18, ease: EASE }}
              className="w-full rounded-full border border-linen/25 px-9 py-4 text-sm font-medium tracking-wide text-cream backdrop-blur-md transition-all duration-500 hover:border-linen/55 hover:bg-cream/[0.07] sm:w-auto"
            >
              Visit Amaia&rsquo;s
            </motion.a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.5 }}
            style={{ opacity: subOpacity }}
            className="font-kannada mt-10 text-xs tracking-[0.18em] text-mist/45 md:mt-12 md:text-sm"
          >
            {SITE.nameKannada}
          </motion.p>
        </div>

        {/* ---------- Layer 5 · scroll cue ---------- */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute inset-x-0 bottom-7 z-20 flex justify-center md:bottom-10"
        >
          <motion.a
            href="#story"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="group flex flex-col items-center gap-3"
            aria-label="Scroll to explore"
          >
            <span className="text-[0.6rem] tracking-[0.42em] text-mist/50 transition-colors group-hover:text-linen/80">
              SCROLL
            </span>
            <span className="relative block h-11 w-[1px] overflow-hidden bg-linen/15">
              <motion.span
                className="absolute inset-x-0 top-0 block h-1/2 bg-gradient-to-b from-transparent via-amber to-transparent"
                animate={calm ? {} : { y: ["-100%", "220%"] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.35 }}
              />
            </span>
          </motion.a>
        </motion.div>

        {/* ---------- Layer 6 · arriving horizon ---------- */}
        <motion.div
          aria-hidden
          style={{ opacity: horizonOpacity, scaleY: horizonScale }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 origin-bottom"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/70 to-transparent" />
          <div className="absolute inset-x-[12%] bottom-0 h-px bg-gradient-to-r from-transparent via-caramel/60 to-transparent blur-[1px]" />
        </motion.div>

        <Grain />
      </section>
    </div>
  );
}
