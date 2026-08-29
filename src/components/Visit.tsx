"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { IMG } from "@/lib/images";
import { SITE } from "@/lib/site";
import { EASE, Reveal, RevealLines, useCalm } from "@/components/ui/motion";
import { Bloom, Grain, Steam } from "@/components/ui/Atmosphere";

/**
 * SECTION 8 — Your Coffee Break Starts Here.
 * Motion language: *the address as signage*. The details are set as a
 * plate rather than a contact form: a drawn map marker with a pulsing
 * ring, a hairline-ruled detail list that draws itself in, and a warm
 * image panel that rises against the scroll.
 */

const DETAILS = [
  { k: "Address", v: [SITE.address.line1, SITE.address.line2, SITE.address.line3, SITE.address.line4] },
  { k: "Phone", v: [SITE.phone] },
  { k: "Hours", v: [SITE.hours] },
  { k: "Per Person", v: [SITE.price] },
];

export default function Visit() {
  const section = useRef<HTMLElement>(null);
  const calm = useCalm();

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  });

  const panelY = useTransform(scrollYProgress, [0, 1], calm ? ["0%", "0%"] : ["12%", "-12%"]);

  return (
    <section
      ref={section}
      id="visit"
      className="relative z-10 overflow-hidden bg-ink py-24 md:py-36"
      aria-label="Visit Amaia's Coffee House"
    >
      <Bloom color="#c08a4e" size={560} opacity={0.13} top="10%" left="-12%" duration={40} />
      <Grain />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-12 gap-y-14 md:gap-x-10">
          {/* ---------- left: the plate ---------- */}
          <div className="col-span-12 lg:col-span-6">
            <Reveal>
              <p className="eyebrow mb-5">Visit Us</p>
            </Reveal>
            <h2 className="display-lg font-display text-cream">
              <RevealLines lines={[<>Your Coffee Break</>, <>Starts <em className="not-italic text-caramel">Here.</em></>]} />
            </h2>

            <Reveal delay={0.25}>
              <div className="mt-10 md:mt-12">
                <p className="font-display text-2xl tracking-tight text-cream md:text-3xl">
                  AMAIA&rsquo;S COFFEE HOUSE
                </p>
                <p className="font-kannada mt-2 text-base text-linen/60 md:text-lg">
                  {SITE.nameKannada}
                </p>
              </div>
            </Reveal>

            <dl className="mt-10 md:mt-12">
              {DETAILS.map((d, i) => (
                <motion.div
                  key={d.k}
                  className="grid grid-cols-3 gap-4 border-t border-linen/[0.09] py-5"
                  initial={calm ? { opacity: 0 } : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: calm ? 0.3 : 0.9, delay: i * 0.1, ease: EASE }}
                >
                  <dt className="text-[0.65rem] tracking-[0.24em] text-mist/45">
                    {d.k.toUpperCase()}
                  </dt>
                  <dd className="col-span-2 text-sm leading-relaxed text-linen/85 md:text-base">
                    {d.k === "Phone" ? (
                      <a
                        href={SITE.phoneHref}
                        className="transition-colors hover:text-amber"
                      >
                        {d.v[0]}
                      </a>
                    ) : (
                      d.v.map((line) => <span key={line} className="block">{line}</span>)
                    )}
                  </dd>
                </motion.div>
              ))}
              <div className="border-t border-linen/[0.09]" />
            </dl>

            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a
                  href={SITE.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-full bg-cream px-8 py-4 text-center text-sm font-medium text-ink transition-transform duration-500 hover:scale-[1.03]"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-[900ms] group-hover:translate-x-full" />
                  <span className="relative">Get Directions</span>
                </a>
                <a
                  href={SITE.phoneHref}
                  className="rounded-full border border-linen/25 px-8 py-4 text-center text-sm font-medium text-cream transition-all duration-500 hover:border-linen/55 hover:bg-cream/[0.06]"
                >
                  Call Us
                </a>
              </div>
            </Reveal>
          </div>

          {/* ---------- right: image panel + marker ---------- */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <motion.div
              style={{ y: panelY }}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl md:aspect-[3/4]"
            >
              <Image
                src={IMG.scene5.src}
                alt={IMG.scene5.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                placeholder="blur"
                blurDataURL={IMG.scene5.blurDataURL}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/40" />
              <Steam count={4} height={220} peak={0.22} seed={53} />
              <div className="absolute inset-0 ring-1 ring-inset ring-linen/10" />

              {/* map marker */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <span className="relative mt-1 grid h-10 w-10 shrink-0 place-items-center">
                    <motion.span
                      className="absolute inset-0 rounded-full border border-amber/50"
                      animate={calm ? {} : { scale: [1, 1.9], opacity: [0.7, 0] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
                    />
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-amber/15 ring-1 ring-amber/40 backdrop-blur-sm">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="var(--color-amber)" strokeWidth="1.8">
                        <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" strokeLinejoin="round" />
                        <circle cx="12" cy="10" r="2.4" />
                      </svg>
                    </span>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-cream">BTM 2nd Stage, Kuvempu Nagar</p>
                    <p className="mt-1 text-xs leading-relaxed text-linen/60">
                      3rd Cross Rd, BTM Layout · Bengaluru 560076
                    </p>
                    <a
                      href={SITE.directions}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber transition-colors hover:text-cream"
                    >
                      Open in Google Maps
                      <span aria-hidden>↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
