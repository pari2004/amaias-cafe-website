"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { IMG } from "@/lib/images";
import { Counter, EASE, Reveal, RevealLines, WordsIn, useCalm, useSeen } from "@/components/ui/motion";
import { Bloom, Grain, Steam } from "@/components/ui/Atmosphere";

/**
 * SECTION 1 — More Than Just Coffee.
 * Motion language: *unmasking*. Images arrive by wiping open from the
 * bottom edge while their contents counter-move, an asymmetric editorial
 * column set answers with line-by-line text, and the stat row counts up.
 * This is the section the hero slides beneath, so it owns a rounded top
 * edge and its own ground colour.
 */

const STATS = [
  { value: 4.9, decimals: 1, suffix: " ★", label: "Google Rating" },
  { value: 26, decimals: 0, suffix: "+", label: "Happy Reviews" },
  { static: "₹1–₹200", label: "Per Person" },
  { static: "11:30 PM", label: "Open Until" },
] as const;

export default function Story() {
  const section = useRef<HTMLElement>(null);
  const calm = useCalm();

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  });

  // Both figures wipe themselves open, so the observers live on their
  // unclipped wrappers rather than on the figures.
  const [plateRef, plateSeen] = useSeen<HTMLDivElement>(0.25);
  const [insetRef, insetSeen] = useSeen<HTMLDivElement>(0.35);

  const flat = <T,>(a: T, b: T): [T, T] => (calm ? [a, a] : [a, b]);

  const bigImgY = useTransform(scrollYProgress, [0, 1], flat("-8%", "8%"));
  const insetY = useTransform(scrollYProgress, [0, 1], flat("14%", "-14%"));
  const wordY = useTransform(scrollYProgress, [0, 1], flat(90, -90));
  const wordOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.75, 1], [0, 0.05, 0.05, 0]);

  return (
    <section
      ref={section}
      id="story"
      className="relative z-10 -mt-px overflow-hidden rounded-t-[2rem] bg-espresso pb-24 pt-24 shadow-[0_-40px_80px_-20px_rgba(0,0,0,0.85)] md:rounded-t-[3.5rem] md:pb-36 md:pt-36"
    >
      <Bloom color="#533a28" size={640} opacity={0.22} top="8%" right="-14%" duration={34} />
      <Bloom color="#33241a" size={520} opacity={0.3} bottom="10%" left="-12%" duration={42} delay={-11} />

      {/* slow-drifting background word */}
      <motion.span
        aria-hidden
        style={{ y: wordY, opacity: wordOpacity }}
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 select-none whitespace-nowrap font-display text-[22vw] leading-none text-linen"
      >
        amaia&rsquo;s
      </motion.span>

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        {/* ---------- heading block ---------- */}
        <div className="grid grid-cols-12 gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <Reveal>
              <p className="eyebrow mb-6">Our Story</p>
            </Reveal>
            <h2 className="display-lg font-display text-cream">
              <RevealLines
                lines={[
                  <>More Than </>,
                  <>
                    Just <em className="not-italic text-caramel">Coffee.</em>
                  </>,
                ]}
              />
            </h2>
          </div>

          <div className="col-span-12 flex items-end lg:col-span-4 lg:col-start-9">
            <div className="max-w-md">
              <WordsIn
                className="text-base leading-relaxed text-linen/65 md:text-lg"
                text="Amaia's began with a simple idea — that a neighbourhood deserves a room where the coffee is honest, the food is generous, and nobody is ever rushed out."
                delay={0.15}
              />
              <Reveal delay={0.5}>
                <div className="hairline mt-8 h-px w-full" />
                <p className="mt-8 text-sm leading-relaxed text-mist/55">
                  Tucked into a quiet cross road in BTM 2nd Stage, it has become the
                  corner people return to — for a ₹20 filter coffee before work, a
                  long table of friends at 10 PM, and everything in between.
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ---------- asymmetric image composition ---------- */}
        <div className="relative mt-16 grid grid-cols-12 items-start gap-6 md:mt-24 md:gap-8">
          {/* large plate — wipes open from the bottom */}
          <div ref={plateRef} className="col-span-12 lg:col-span-8">
          <motion.figure
            className="relative"
            initial={calm ? { opacity: 0 } : { clipPath: "inset(100% 0% 0% 0%)" }}
            animate={
              plateSeen
                ? { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }
                : calm
                  ? { opacity: 0 }
                  : { clipPath: "inset(100% 0% 0% 0%)" }
            }
            transition={{ duration: calm ? 0.4 : 1.5, ease: EASE }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl md:aspect-[16/10] md:rounded-2xl">
              <motion.div style={{ y: bigImgY }} className="absolute -inset-y-[10%] inset-x-0">
                <Image
                  src={IMG.story.src}
                  alt={IMG.story.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  placeholder="blur"
                  blurDataURL={IMG.story.blurDataURL}
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
              <Grain />
            </div>
            <figcaption className="mt-4 flex items-center gap-3 text-xs tracking-[0.2em] text-mist/45">
              <span className="h-px w-8 bg-caramel/50" />
              GOOD COFFEE · GOOD FOOD · GOOD VIBES
            </figcaption>
          </motion.figure>
          </div>

          {/* tall inset — offset, drifts against the large plate */}
          <div
            ref={insetRef}
            className="col-span-8 col-start-3 -mt-8 sm:col-span-6 sm:col-start-4 lg:col-span-3 lg:col-start-10 lg:mt-20"
          >
          <motion.figure
            className="relative"
            initial={{ clipPath: "inset(0% 0% 100% 0%)", opacity: 0 }}
            animate={
              insetSeen
                ? { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }
                : { opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }
            }
            transition={{ duration: calm ? 0.4 : 1.4, delay: 0.2, ease: EASE }}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl">
              <motion.div style={{ y: insetY }} className="absolute -inset-y-[12%] inset-x-0">
                <Image
                  src={IMG.storyInset.src}
                  alt={IMG.storyInset.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL={IMG.storyInset.blurDataURL}
                  className="object-cover"
                />
              </motion.div>
              <Steam count={3} height={160} peak={0.28} seed={21} />
              <div className="absolute inset-0 ring-1 ring-inset ring-linen/10" />
            </div>
          </motion.figure>
          </div>
        </div>

        {/* ---------- statistics ---------- */}
        <div className="mt-20 md:mt-28">
          <div className="hairline h-px w-full" />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 pt-10 md:grid-cols-4 md:gap-x-10 md:pt-14">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.09} y={22}>
                <div className="group">
                  <dd className="font-display text-[2.1rem] leading-none tracking-tight text-cream transition-colors duration-500 group-hover:text-amber md:text-[3.25rem]">
                    {"static" in s ? (
                      s.static
                    ) : (
                      <Counter to={s.value} decimals={s.decimals} suffix={s.suffix} />
                    )}
                  </dd>
                  <dt className="mt-3 text-[0.68rem] tracking-[0.24em] text-mist/50 md:text-xs">
                    {s.label.toUpperCase()}
                  </dt>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
