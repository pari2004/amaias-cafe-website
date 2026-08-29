"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { IMG, type Img } from "@/lib/images";
import { EASE, Reveal, RevealLines, useCalm, useSeen } from "@/components/ui/motion";
import { Bloom, Grain } from "@/components/ui/Atmosphere";
import Lightbox from "@/components/ui/Lightbox";

/**
 * SECTION 3 — Coffee Deserves Good Company.
 * Motion language: *architecture assembling*. Tiles wipe in from four
 * different edges on a bento grid of deliberately unequal weights, then
 * respond to the pointer with a slow push-in and a rising caption.
 * Nothing here is a uniform product card.
 *
 * The menu poster is reachable only from the chip at the foot of this
 * section — it is a price list, never a background.
 */

type Dish = {
  img: Img;
  name: string;
  kind: string;
  className: string;
  from: "top" | "bottom" | "left" | "right";
  sizes: string;
};

const DISHES: Dish[] = [
  {
    img: IMG.sandwichCorn2,
    name: "Corn Cheese Sandwich",
    kind: "Grilled · Signature",
    className: "col-span-2 row-span-2 md:col-span-7 md:row-span-3",
    from: "bottom",
    sizes: "(max-width: 768px) 100vw, 58vw",
  },
  {
    img: IMG.periFries,
    name: "Peri Peri Fries",
    kind: "Starters",
    className: "col-span-2 row-span-2 md:col-span-5 md:row-span-2",
    from: "right",
    sizes: "(max-width: 768px) 100vw, 42vw",
  },
  {
    img: IMG.potatoBites,
    name: "Potato Cheese Bites",
    kind: "Starters",
    className: "col-span-2 row-span-1 md:col-span-5 md:row-span-1",
    from: "right",
    sizes: "(max-width: 768px) 100vw, 42vw",
  },
  {
    img: IMG.chickenStrips,
    name: "Chicken Strips",
    kind: "Chicken Starters",
    className: "col-span-1 row-span-2 md:col-span-4 md:row-span-2",
    from: "left",
    sizes: "(max-width: 768px) 50vw, 34vw",
  },
  {
    img: IMG.cornNuggets,
    name: "Corn Cheese Nuggets",
    kind: "Tea Starters",
    className: "col-span-1 row-span-2 md:col-span-4 md:row-span-2",
    from: "bottom",
    sizes: "(max-width: 768px) 50vw, 34vw",
  },
  {
    img: IMG.iceCream,
    name: "Chocolate Ice Cream",
    kind: "Something Sweet",
    className: "col-span-2 row-span-1 md:col-span-4 md:row-span-2",
    from: "top",
    sizes: "(max-width: 768px) 100vw, 34vw",
  },
];

const CLIP: Record<Dish["from"], string> = {
  top: "inset(0% 0% 100% 0%)",
  bottom: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

function Tile({ dish, i, calm }: { dish: Dish; i: number; calm: boolean }) {
  // The tile wipes itself in, so the observer goes on the wrapper.
  const [ref, seen] = useSeen<HTMLDivElement>(0.2);
  const hidden = calm
    ? { opacity: 0, clipPath: "inset(0% 0% 0% 0%)" }
    : { clipPath: CLIP[dish.from], opacity: 0.4 };

  return (
    <div ref={ref} className={`relative ${dish.className}`}>
    <motion.figure
      className="group absolute inset-0 overflow-hidden rounded-lg bg-bean md:rounded-xl"
      initial={hidden}
      animate={seen ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 } : hidden}
      transition={{ duration: calm ? 0.35 : 1.25, delay: (i % 3) * 0.11, ease: EASE }}
    >
      <Image
        src={dish.img.src}
        alt={dish.img.alt}
        fill
        sizes={dish.sizes}
        placeholder="blur"
        blurDataURL={dish.img.blurDataURL}
        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform group-hover:scale-[1.07]"
      />

      {/* resting scrim keeps captions legible; deepens on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent transition-opacity duration-700 group-hover:opacity-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      <figcaption className="absolute inset-x-0 bottom-0 p-4 md:p-6">
        <span className="block text-[0.6rem] tracking-[0.26em] text-amber/0 transition-all duration-700 group-hover:text-amber/85 md:text-[0.65rem]">
          {dish.kind.toUpperCase()}
        </span>
        <span className="mt-1 block font-display text-base leading-tight text-cream transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 md:text-2xl">
          {dish.name}
        </span>
      </figcaption>

      <span className="absolute inset-0 rounded-lg ring-1 ring-inset ring-linen/[0.07] transition-all duration-700 group-hover:ring-caramel/30 md:rounded-xl" />
    </motion.figure>
    </div>
  );
}

export default function FoodExperience() {
  const calm = useCalm();
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  return (
    <section id="food" className="relative z-10 overflow-hidden bg-espresso py-24 md:py-36">
      <Bloom color="#533a28" size={620} opacity={0.24} top="20%" left="-16%" duration={40} />
      <Bloom color="#a5643a" size={420} opacity={0.10} bottom="8%" right="-10%" duration={33} delay={-8} />
      <Grain />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-12 items-end gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <Reveal>
              <p className="eyebrow mb-5">The Kitchen</p>
            </Reveal>
            <h2 className="display-lg font-display text-cream">
              <RevealLines
                lines={[<>Coffee Deserves</>, <>Good <em className="not-italic text-caramel">Company.</em></>]}
              />
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.2}>
              <p className="text-sm leading-relaxed text-linen/60 md:text-base">
                Grilled sandwiches, hot starters and something sweet at the end —
                made to be shared across the table while the conversation runs long.
              </p>
            </Reveal>
          </div>
        </div>

        {/* ---------- bento ---------- */}
        <div className="mt-14 grid auto-rows-[minmax(105px,1fr)] grid-cols-2 gap-2.5 md:mt-20 md:auto-rows-[minmax(120px,1fr)] md:grid-cols-12 md:gap-4">
          {DISHES.map((d, i) => (
            <Tile key={d.name} dish={d} i={i} calm={calm} />
          ))}
        </div>

        {/* ---------- menu chip ---------- */}
        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col items-center gap-5 md:mt-16">
            <div className="hairline h-px w-full" />
            <button
              type="button"
              onClick={() => setMenuOpen(0)}
              className="group flex items-center gap-4 rounded-full border border-linen/15 py-3 pl-4 pr-6 transition-all duration-500 hover:border-caramel/50 hover:bg-cream/[0.04]"
            >
              <span className="relative h-11 w-8 shrink-0 overflow-hidden rounded-sm ring-1 ring-linen/20">
                <Image
                  src={IMG.menuPoster.src}
                  alt=""
                  fill
                  sizes="32px"
                  placeholder="blur"
                  blurDataURL={IMG.menuPoster.blurDataURL}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </span>
              <span className="text-left">
                <span className="block text-sm font-medium text-cream">See the full menu</span>
                <span className="block text-[0.7rem] text-mist/55">
                  Hot &amp; cold coffee · starters · sandwiches · maggi · pasta · scoops
                </span>
              </span>
              <span className="ml-2 text-caramel transition-transform duration-500 group-hover:translate-x-1">
                ↗
              </span>
            </button>
          </div>
        </Reveal>
      </div>

      <Lightbox
        items={[IMG.menuPoster]}
        index={menuOpen}
        onClose={() => setMenuOpen(null)}
        caption="Amaia's Coffee House full menu"
      />
    </section>
  );
}
