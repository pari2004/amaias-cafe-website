"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { IMG, type Img } from "@/lib/images";
import { EASE, Reveal, RevealLines, useCalm } from "@/components/ui/motion";
import { Bloom, Grain } from "@/components/ui/Atmosphere";
import Lightbox from "@/components/ui/Lightbox";

/**
 * SECTION 7 — Moments at Amaia's.
 * Motion language: *discovery*. A continuous horizontal band runs above a
 * true masonry field where every tile drifts at its own rate, so the wall
 * never resolves into a grid of equal cards. Any tile opens full-size.
 */

const BAND: Img[] = [
  IMG.coffeeCappuccino,
  IMG.periFries,
  IMG.sandwichVeg,
  IMG.coffeeCold,
  IMG.chickenPopcorn,
  IMG.sandwichBoard,
  IMG.iceCream,
  IMG.americanFries,
];

const WALL: Img[] = [
  IMG.sandwichCorn,
  IMG.coffeeCappuccino,
  IMG.potatoBites,
  IMG.chickenStrips,
  IMG.sandwichVeg2,
  IMG.coffeeCold,
  IMG.cornNuggets,
  IMG.sandwichCheese,
  IMG.periFries,
  IMG.chickenNuggets,
  IMG.coffeeSpecial,
  IMG.sandwichBoard,
  IMG.americanFries,
  IMG.iceCream,
  IMG.chickenPopcorn,
];

/** Varying aspect ratios so the wall never falls into a rhythm. */
const RATIOS = [
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[5/4]",
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-[5/4]",
  "aspect-[4/5]",
  "aspect-square",
];

const DRIFT = [-52, 24, -18, 44, -34, 12, -46, 30, -22, 50, -30, 18, -40, 26, -14];

function Tile({
  img,
  i,
  onOpen,
  progress,
  calm,
}: {
  img: Img;
  i: number;
  onOpen: () => void;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  calm: boolean;
}) {
  const d = DRIFT[i % DRIFT.length];
  const y = useTransform(progress, [0, 1], calm ? [0, 0] : [d, -d]);

  return (
    <motion.figure
      style={{ y }}
      className="mb-3 break-inside-avoid md:mb-4"
      initial={calm ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: calm ? 0.35 : 1.05, delay: (i % 4) * 0.07, ease: EASE }}
    >
      <button
        type="button"
        onClick={onOpen}
        className={`group relative block w-full overflow-hidden rounded-lg bg-bean ${RATIOS[i % RATIOS.length]}`}
        aria-label={`Open image: ${img.alt}`}
      >
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes="(max-width: 768px) 48vw, (max-width: 1280px) 32vw, 24vw"
          placeholder="blur"
          blurDataURL={img.blurDataURL}
          className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
        />
        <span className="absolute inset-0 bg-ink/25 transition-opacity duration-700 group-hover:opacity-0" />
        <span className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <span className="absolute bottom-3 left-3 right-3 translate-y-3 text-left text-[0.7rem] leading-snug text-cream opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
          {img.alt}
        </span>
        <span className="absolute right-3 top-3 grid h-7 w-7 scale-75 place-items-center rounded-full bg-cream/90 text-xs text-ink opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
          ↗
        </span>
        <span className="absolute inset-0 rounded-lg ring-1 ring-inset ring-linen/[0.08]" />
      </button>
    </motion.figure>
  );
}

export default function Gallery() {
  const section = useRef<HTMLElement>(null);
  const calm = useCalm();
  const [open, setOpen] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  });

  const bandX = useTransform(scrollYProgress, [0, 1], calm ? ["0%", "0%"] : ["3%", "-14%"]);

  return (
    <section
      ref={section}
      id="gallery"
      className="relative z-10 overflow-hidden bg-espresso py-24 md:py-36"
      aria-label="Moments at Amaia's"
    >
      <Bloom color="#533a28" size={640} opacity={0.26} top="30%" right="-16%" duration={44} />
      <Grain />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-12 items-end gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <Reveal>
              <p className="eyebrow mb-5">The Gallery</p>
            </Reveal>
            <h2 className="display-lg font-display text-cream">
              <RevealLines lines={[<>Moments at </>, <><em className="not-italic text-caramel">Amaia&rsquo;s.</em></>]} />
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.2}>
              <p className="text-sm leading-relaxed text-linen/60 md:text-base">
                Tap anything to see it full size.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ---------- horizontal band ---------- */}
      <div className="relative mt-12 md:mt-16">
        <motion.div style={{ x: bandX }} className="mask-fade-x">
          <div
            className="marquee-track gap-3 md:gap-4"
            style={{ "--marquee-dur": "58s" } as React.CSSProperties}
          >
            {[...BAND, ...BAND].map((img, i) => (
              <span
                key={`${img.src}-${i}`}
                className="relative h-40 w-56 shrink-0 overflow-hidden rounded-lg bg-bean md:h-56 md:w-80"
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 224px, 320px"
                  placeholder="blur"
                  blurDataURL={img.blurDataURL}
                  className="object-cover opacity-80"
                />
                <span className="absolute inset-0 rounded-lg ring-1 ring-inset ring-linen/[0.08]" />
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ---------- masonry wall ---------- */}
      <div className="relative mx-auto mt-4 max-w-[1400px] px-6 md:mt-8 md:px-12">
        <div className="columns-2 gap-3 md:columns-3 md:gap-4 xl:columns-4">
          {WALL.map((img, i) => (
            <Tile
              key={`${img.src}-${i}`}
              img={img}
              i={i}
              calm={calm}
              progress={scrollYProgress}
              onOpen={() => setOpen(i)}
            />
          ))}
        </div>
      </div>

      <Lightbox items={WALL} index={open} onClose={() => setOpen(null)} onStep={setOpen} />
    </section>
  );
}
