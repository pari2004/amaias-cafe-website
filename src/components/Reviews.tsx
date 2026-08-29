"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { REVIEWS, SITE } from "@/lib/site";
import { Counter, EASE, Reveal, RevealLines, useCalm } from "@/components/ui/motion";
import { Bloom, Grain } from "@/components/ui/Atmosphere";

/**
 * SECTION 6 — Loved by Coffee Lovers.
 * Motion language: *editorial layering*. A giant 4.9 anchors the left as
 * a piece of typography rather than a badge; the quotes arrive on a
 * diagonal at three depths and lift on hover. A slow background marquee
 * of the tagline runs behind everything. No slider, no dots.
 */

function Stars({ active }: { active: boolean }) {
  return (
    <span className="flex gap-1" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 md:h-4 md:w-4"
          initial={{ opacity: 0, scale: 0.4, rotate: -35 }}
          animate={active ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 + i * 0.08, ease: EASE }}
        >
          <path
            d="M12 2.2l2.9 6.06 6.6.9-4.8 4.6 1.17 6.6L12 17.3 6.13 20.36 7.3 13.76 2.5 9.16l6.6-.9L12 2.2z"
            fill="var(--color-amber)"
          />
        </motion.svg>
      ))}
    </span>
  );
}

export default function Reviews() {
  const section = useRef<HTMLElement>(null);
  const calm = useCalm();
  const [seen, setSeen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  });

  const marqueeX = useTransform(scrollYProgress, [0, 1], calm ? ["0%", "0%"] : ["6%", "-18%"]);
  const bigY = useTransform(scrollYProgress, [0, 1], calm ? [0, 0] : [60, -60]);

  const OFFSETS = ["lg:mt-0", "lg:mt-16", "lg:mt-8"];

  return (
    <section
      ref={section}
      id="reviews"
      className="relative z-10 overflow-hidden bg-ink py-24 md:py-36"
      aria-label="Reviews"
    >
      <Bloom color="#c08a4e" size={560} opacity={0.10} top="4%" right="6%" duration={38} />
      <Grain />

      {/* background typography drifting behind */}
      <motion.span
        aria-hidden
        style={{ x: marqueeX }}
        className="pointer-events-none absolute top-[38%] select-none whitespace-nowrap font-display text-[17vw] leading-none text-linen/[0.035]"
      >
        good coffee · good food · good vibes · good coffee · good food ·
      </motion.span>

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-y-14">
          {/* ---------- the rating, as type ---------- */}
          <motion.div style={{ y: bigY }} className="col-span-12 lg:col-span-4">
            <Reveal>
              <p className="eyebrow mb-6">Reviews</p>
            </Reveal>
            <h2 className="display-md font-display text-cream">
              <RevealLines lines={[<>Loved by</>, <><em className="not-italic text-caramel">Coffee</em> Lovers.</>]} />
            </h2>

            <motion.div
              className="mt-10 flex items-end gap-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.1, ease: EASE }}
              onViewportEnter={() => setSeen(true)}
            >
              <span className="font-display text-[5.5rem] leading-[0.8] tracking-tight text-cream md:text-[8rem]">
                <Counter to={4.9} decimals={1} />
              </span>
              <div className="pb-3">
                <Stars active={seen} />
                <p className="mt-2 text-[0.7rem] tracking-[0.2em] text-mist/50">
                  {SITE.reviewCount}+ GOOGLE REVIEWS
                </p>
              </div>
            </motion.div>

            <Reveal delay={0.3}>
              <div className="hairline mt-10 h-px w-full" />
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-linen/55">
                Rated by the people who actually sit here — regulars, students,
                and the BTM Layout evening crowd.
              </p>
            </Reveal>
          </motion.div>

          {/* ---------- the quotes, on a diagonal ---------- */}
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <div className="grid gap-5 md:gap-6 lg:grid-cols-3">
              {REVIEWS.map((r, i) => (
                <motion.figure
                  key={r.author}
                  className={`group relative flex flex-col rounded-xl border border-linen/[0.09] bg-gradient-to-b from-bean/80 to-espresso/60 p-6 backdrop-blur-sm transition-all duration-700 hover:-translate-y-1.5 hover:border-caramel/35 hover:shadow-[0_24px_60px_-24px_rgba(192,138,78,0.35)] md:p-7 ${OFFSETS[i]}`}
                  initial={calm ? { opacity: 0 } : { opacity: 0, y: 60, rotate: i % 2 ? 1.6 : -1.6 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: calm ? 0.35 : 1.1, delay: i * 0.13, ease: EASE }}
                >
                  <span
                    aria-hidden
                    className="absolute right-5 top-3 font-display text-6xl leading-none text-caramel/15 transition-colors duration-700 group-hover:text-caramel/30"
                  >
                    &rdquo;
                  </span>
                  <Stars active={seen} />
                  <blockquote className="mt-5 flex-1 font-display text-lg leading-snug text-cream md:text-xl">
                    {r.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-linen/[0.08] pt-5">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-caramel/15 text-xs font-medium text-amber">
                      {r.author.charAt(0)}
                    </span>
                    <span>
                      <span className="block text-sm text-linen/85">{r.author}</span>
                      <span className="block text-[0.65rem] tracking-[0.16em] text-mist/45">
                        {r.role.toUpperCase()}
                      </span>
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
