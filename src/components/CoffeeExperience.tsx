"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { IMG, type Img } from "@/lib/images";
import { EASE, RevealLines, useCalm } from "@/components/ui/motion";
import { Bloom, Grain, Steam, Vignette } from "@/components/ui/Atmosphere";

/**
 * SECTION 2 — Crafted for Every Coffee Moment.
 * Motion language: *pinned sequence*. The section pins while five brews
 * cross-dissolve through a single frame at different depths — the heading
 * holds still, the numeral swaps, the copy re-types itself. Deliberately
 * not a card grid.
 */

type Brew = { n: string; name: string; note: string; img: Img };

const BREWS: Brew[] = [
  {
    n: "01",
    name: "Filter Coffee",
    note: "Decoction and milk, the way Bengaluru mornings have always taken it. Strong, sweet, unhurried.",
    img: IMG.coffeeFilter,
  },
  {
    n: "02",
    name: "Espresso",
    note: "One short, dark pull. No milk to hide behind — just the roast, honest and warm.",
    img: IMG.coffeeEspresso,
  },
  {
    n: "03",
    name: "Cappuccino",
    note: "Steamed thick, poured slow, finished with a rosetta that lasts about four good sips.",
    img: IMG.coffeeCappuccino,
  },
  {
    n: "04",
    name: "Cold Coffee",
    note: "Blended cold and served tall — the order that carries a Bengaluru afternoon.",
    img: IMG.coffeeCold,
  },
  {
    n: "05",
    name: "Special Brews",
    note: "Jaggery, hazelnut, chocolate. The house experiments, for days you want something else.",
    img: IMG.coffeeSpecial,
  },
];

const N = BREWS.length;

function Frame({
  brew,
  index,
  progress,
  calm,
}: {
  brew: Brew;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  calm: boolean;
}) {
  // Every input range stays inside [0, 1]: framer-motion accelerates
  // scroll-linked values through WAAPI, which rejects offsets outside it.
  const first = index === 0;
  const last = index === N - 1;
  const start = index / N;
  const end = (index + 1) / N;
  const pad = 0.055;

  const lo = first ? 0 : start - pad;
  const hi = last ? 1 : end + pad;
  const inA = first ? 0.0001 : start + pad * 0.4;
  const inB = last ? 0.9999 : end - pad * 0.4;

  const opacity = useTransform(
    progress,
    [lo, inA, inB, hi],
    [first ? 1 : 0, 1, 1, last ? 1 : 0]
  );
  const scale = useTransform(progress, [lo, hi], calm ? [1, 1] : [1.18, 0.96]);
  const y = useTransform(progress, [lo, hi], calm ? ["0%", "0%"] : ["6%", "-6%"]);

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{ opacity }}
      aria-hidden={index !== 0}
    >
      <motion.div className="absolute inset-0" style={{ scale, y }}>
        <Image
          src={brew.img.src}
          alt={brew.img.alt}
          fill
          sizes="(max-width: 1024px) 92vw, 46vw"
          placeholder="blur"
          blurDataURL={brew.img.blurDataURL}
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/25" />
    </motion.div>
  );
}

export default function CoffeeExperience() {
  const wrap = useRef<HTMLElement>(null);
  const calm = useCalm();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    setActive((prev) => (prev === i ? prev : i));
  });

  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={wrap}
      id="coffee"
      className="relative z-10 bg-ink"
      style={{ height: `${N * 100}svh` }}
      aria-label="Crafted for every coffee moment"
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <Bloom color="#c08a4e" size={560} opacity={0.11} top="-10%" left="30%" duration={36} />
        <Bloom color="#33241a" size={700} opacity={0.35} bottom="-20%" right="-10%" duration={44} delay={-14} />

        <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-12 items-center gap-8 px-6 md:px-12">
          {/* ---------- left: fixed heading + index ---------- */}
          <div className="col-span-12 lg:col-span-5">
            <p className="eyebrow mb-5">The Coffee</p>
            <h2 className="display-md font-display text-cream">
              <RevealLines
                lines={[<>Crafted for Every </>, <><em className="not-italic text-caramel">Coffee</em> Moment.</>]}
              />
            </h2>

            {/* the copy swaps with the frame */}
            <div className="relative mt-7 h-24 md:mt-10 md:h-28">
              {BREWS.map((b, i) => (
                <motion.div
                  key={b.name}
                  className="absolute inset-0"
                  initial={false}
                  animate={
                    active === i
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : { opacity: 0, y: active > i ? -18 : 18, filter: "blur(5px)" }
                  }
                  transition={{ duration: calm ? 0.2 : 0.7, ease: EASE }}
                  aria-hidden={active !== i}
                >
                  <p className="max-w-sm text-sm leading-relaxed text-linen/65 md:text-base">
                    {b.note}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* index list — desktop only, keeps mobile calm */}
            <ol className="mt-6 hidden lg:block" aria-label="Coffee menu categories">
              {BREWS.map((b, i) => (
                <li key={b.name}>
                  <button
                    type="button"
                    onClick={() => {
                      const el = wrap.current;
                      if (!el) return;
                      const top = el.offsetTop + (el.offsetHeight - window.innerHeight) * (i / (N - 1));
                      window.scrollTo({ top, behavior: calm ? "auto" : "smooth" });
                    }}
                    className="group flex w-full items-center gap-4 border-b border-linen/[0.07] py-3 text-left transition-colors"
                    aria-current={active === i ? "true" : undefined}
                  >
                    <span
                      className={`w-7 font-mono text-[0.65rem] tracking-widest transition-colors duration-500 ${
                        active === i ? "text-amber" : "text-mist/35"
                      }`}
                    >
                      {b.n}
                    </span>
                    <span
                      className={`font-display text-lg transition-all duration-500 ${
                        active === i
                          ? "translate-x-1 text-cream"
                          : "text-mist/45 group-hover:translate-x-1 group-hover:text-linen/75"
                      }`}
                    >
                      {b.name}
                    </span>
                    <motion.span
                      className="ml-auto h-px bg-caramel"
                      initial={false}
                      animate={{ width: active === i ? 44 : 0, opacity: active === i ? 1 : 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                    />
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* ---------- right: the pinned frame ---------- */}
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-2xl ring-1 ring-inset ring-linen/10 sm:aspect-[5/6] lg:max-w-none">
              {BREWS.map((b, i) => (
                <Frame key={b.name} brew={b} index={i} progress={scrollYProgress} calm={calm} />
              ))}

              <Steam count={5} height={260} peak={0.34} seed={31} className="z-10" />
              <Vignette strength={0.5} />
              <Grain />

              {/* the name, riding on top of the frame */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-6 md:p-8">
                <div className="relative h-[3.2rem] md:h-[4.2rem]">
                  {BREWS.map((b, i) => (
                    <motion.div
                      key={b.name}
                      className="absolute inset-x-0 bottom-0"
                      initial={false}
                      animate={
                        active === i
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: active > i ? -26 : 26 }
                      }
                      transition={{ duration: calm ? 0.2 : 0.65, ease: EASE }}
                      aria-hidden={active !== i}
                    >
                      <span className="block font-mono text-[0.6rem] tracking-[0.3em] text-amber/80">
                        {b.n}
                      </span>
                      <span className="mt-1 block font-display text-3xl text-cream md:text-4xl">
                        {b.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* mobile progress rail */}
            <div className="relative mx-auto mt-6 h-px w-full max-w-[520px] bg-linen/10 lg:hidden">
              <motion.div
                className="absolute inset-y-0 left-0 origin-left bg-caramel"
                style={{ scaleX: railScale, width: "100%" }}
              />
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 lg:hidden" aria-hidden>
              {BREWS.map((b, i) => (
                <span
                  key={b.name}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    active === i ? "w-6 bg-amber" : "w-1.5 bg-linen/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
