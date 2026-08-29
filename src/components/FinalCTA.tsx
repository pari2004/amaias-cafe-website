"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { IMG } from "@/lib/images";
import { SITE, NAV_LINKS } from "@/lib/site";
import { EASE, RevealLines, useCalm } from "@/components/ui/motion";
import { Bloom, Grain, Steam, Vignette } from "@/components/ui/Atmosphere";
import CoffeeParticles from "@/components/ui/CoffeeParticles";

/**
 * FINAL — Come for the Coffee. Stay for the Vibe.
 * A closing frame built the same way the hero was: roast gradient, drifting
 * light, motes and steam, with the texture layer sunk far back. It rhymes
 * with the opening so the page closes where it started.
 * The footer is folded in beneath it.
 */

export default function FinalCTA() {
  const section = useRef<HTMLElement>(null);
  const calm = useCalm();

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end end"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], calm ? [1, 1] : [1.22, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], calm ? ["0%", "0%"] : ["-8%", "0%"]);

  return (
    <footer ref={section} className="relative z-10 overflow-hidden bg-ink">
      {/* ---------- cinematic CTA ---------- */}
      <div className="relative flex min-h-[92svh] items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: bgScale, y: bgY }}>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 100%, #45301d 0%, #241a12 38%, #0d0908 72%, #070505 100%)",
            }}
          />
          <Image
            src={IMG.heroAtmos.src}
            alt=""
            fill
            sizes="100vw"
            quality={70}
            placeholder="blur"
            blurDataURL={IMG.heroAtmos.blurDataURL}
            className="object-cover opacity-25 mix-blend-luminosity"
            style={{
              maskImage: "radial-gradient(80% 65% at 50% 62%, #000 8%, transparent 76%)",
              WebkitMaskImage: "radial-gradient(80% 65% at 50% 62%, #000 8%, transparent 76%)",
            }}
          />
          <Bloom color="#c08a4e" size={640} opacity={0.18} bottom="-16%" left="18%" duration={34} />
          <Bloom color="#a5643a" size={480} opacity={0.12} top="-8%" right="10%" duration={42} delay={-12} />
        </motion.div>

        <CoffeeParticles density={0.8} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5">
          <Steam count={6} height={340} peak={0.26} seed={61} />
        </div>
        <Vignette strength={0.8} />
        <Grain />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-28 text-center md:px-12">
          <motion.p
            className="eyebrow mb-7"
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.32em" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: EASE }}
          >
            One Last Thing
          </motion.p>

          <h2 className="display-lg font-display text-cream">
            <RevealLines
              lines={[
                <>Come for the Coffee.</>,
                <>Stay for the <em className="not-italic bg-gradient-to-br from-amber via-cream to-caramel bg-clip-text text-transparent">Vibe.</em></>,
              ]}
              stagger={0.12}
            />
          </h2>

          <motion.p
            className="mx-auto mt-8 max-w-lg text-balance text-base text-linen/70 md:text-lg"
            initial={calm ? { opacity: 0 } : { opacity: 0, y: 18, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.35, ease: EASE }}
          >
            Your favourite corner in Bengaluru is waiting.
          </motion.p>

          <motion.div
            className="mt-12 flex w-full flex-col items-center gap-3.5 sm:flex-row sm:justify-center sm:gap-4"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.55, ease: EASE }}
          >
            <a
              href={SITE.phoneHref}
              className="group relative w-full overflow-hidden rounded-full bg-cream px-9 py-4 text-sm font-medium text-ink transition-transform duration-500 hover:scale-[1.03] sm:w-auto"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-[900ms] group-hover:translate-x-full" />
              <span className="relative">Visit Amaia&rsquo;s</span>
            </a>
            <a
              href={SITE.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full border border-linen/25 px-9 py-4 text-center text-sm font-medium text-cream backdrop-blur-md transition-all duration-500 hover:border-linen/55 hover:bg-cream/[0.07] sm:w-auto"
            >
              Get Directions
            </a>
          </motion.div>
        </div>
      </div>

      {/* ---------- footer plate ---------- */}
      <div className="relative border-t border-linen/[0.08] bg-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-14 md:px-12">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-display text-xl tracking-[0.14em] text-cream">
                {SITE.nameShort}
              </p>
              <p className="font-kannada mt-2 text-xs text-mist/50">{SITE.nameKannada}</p>
              <p className="mt-4 max-w-xs text-sm text-linen/55">{SITE.tagline}</p>
            </div>

            <nav aria-label="Footer">
              <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5 sm:grid-cols-3 md:flex md:flex-col md:gap-2.5">
                {NAV_LINKS.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-linen/60 transition-colors hover:text-amber"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <address className="not-italic">
              <p className="text-sm leading-relaxed text-linen/60">
                {SITE.address.line1}
                <br />
                {SITE.address.line2}
                <br />
                {SITE.address.line4}
              </p>
              <a
                href={SITE.phoneHref}
                className="mt-4 block text-sm text-linen/80 transition-colors hover:text-amber"
              >
                {SITE.phone}
              </a>
              <p className="mt-1 text-xs text-mist/45">{SITE.hours}</p>
            </address>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-linen/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-mist/40">
              © {new Date().getFullYear()} Amaia&rsquo;s Coffee House · BTM Layout, Bengaluru
            </p>
            <a
              href="#top"
              className="text-xs text-mist/50 transition-colors hover:text-amber"
            >
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
