"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { NAV_LINKS, SITE } from "@/lib/site";
import { EASE, useCalm } from "@/components/ui/motion";
import { LogoMark } from "@/components/ui/Logo";

/**
 * Transparent premium navigation. Condenses on scroll into a floating
 * blurred plate, hides when scrolling down and returns on scroll up, and
 * tracks the section currently in view. The mobile panel is a full-height
 * sheet with staggered links, not a shrunken desktop menu.
 */

export default function Navbar() {
  const calm = useCalm();
  const { scrollY, scrollYProgress } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#top");

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const isCondensed = y > 60;
    const isHidden = y > 420 && y > prev && !open;
    setCondensed((c) => (c !== isCondensed ? isCondensed : c));
    setHidden((h) => (h !== isHidden ? isHidden : h));
  });

  /* Track the section in view for the active link underline. */
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.15, 0.5] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Lock scroll behind the mobile sheet. */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <a href="#story" className="skip-link">
        Skip to content
      </a>

      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: calm ? 0.2 : 0.7, ease: EASE }}
        className="fixed inset-x-0 top-0 z-[70]"
      >
        <div
          className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            condensed
              ? "border-b border-linen/[0.08] bg-ink/70 backdrop-blur-xl backdrop-saturate-150"
              : "border-b border-transparent bg-transparent"
          }`}
        >
          <div
            className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 transition-all duration-700 md:px-12 ${
              condensed ? "py-3.5" : "py-6"
            }`}
          >
            {/* brand */}
            <a href="#top" className="group flex items-center gap-3 leading-none" aria-label="Amaia's Coffee House, home">
              <LogoMark className={`transition-all duration-700 ${condensed ? "h-6 w-6" : "h-8 w-8"}`} />
              <div className="flex flex-col">
                <span
                  className={`font-display tracking-[0.16em] text-cream transition-all duration-700 ${
                    condensed ? "text-base md:text-lg" : "text-lg md:text-xl"
                  }`}
                >
                  {SITE.nameShort}
                </span>
                <span className="mt-0.5 flex items-center gap-2 text-[0.55rem] tracking-[0.24em] text-mist/55 transition-colors group-hover:text-linen/70 md:text-[0.6rem]">
                  COFFEE HOUSE
                  <span className="h-2.5 w-px bg-linen/20" />
                  <span className="font-kannada tracking-normal">{SITE.nameKannada}</span>
                </span>
              </div>
            </a>

            {/* desktop links */}
            <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="group relative py-1 text-[0.82rem] text-linen/70 transition-colors hover:text-cream"
                  aria-current={active === l.href ? "page" : undefined}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-caramel transition-all duration-500 ${
                      active === l.href ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href={SITE.instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full border border-linen/15 text-cream transition-all duration-300 hover:border-amber/50 hover:bg-cream/[0.08] hover:text-amber"
                aria-label="Follow Amaia's Coffee House on Instagram"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              <a
                href="#visit"
                className="hidden rounded-full bg-cream px-6 py-2.5 text-[0.8rem] font-medium text-ink transition-transform duration-500 hover:scale-105 sm:block"
              >
                Visit Us
              </a>

              {/* mobile toggle */}
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-full border border-linen/15 text-cream transition-colors hover:border-linen/40 lg:hidden"
                aria-label="Open menu"
                aria-expanded={open}
              >
                <span className="flex flex-col gap-[5px]">
                  <span className="block h-px w-4 bg-current" />
                  <span className="block h-px w-4 bg-current" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* reading progress */}
        <div className="h-px w-full bg-transparent">
          <motion.div
            className="h-px origin-left bg-gradient-to-r from-caramel via-amber to-caramel"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
      </motion.header>

      {/* ---------- mobile sheet ---------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <motion.div
              className="absolute inset-0 bg-espresso"
              initial={calm ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
              animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
              exit={calm ? { opacity: 0 } : { clipPath: "inset(0% 0% 100% 0%)" }}
              transition={{ duration: calm ? 0.2 : 0.7, ease: EASE }}
            />

            <div className="relative flex h-full flex-col px-6 pb-10 pt-6">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg tracking-[0.16em] text-cream">
                  {SITE.nameShort}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-linen/20 text-cream"
                  aria-label="Close menu"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <nav className="mt-auto" aria-label="Mobile">
                <ul>
                  {NAV_LINKS.map((l, i) => (
                    <li key={l.label} className="overflow-hidden border-b border-linen/[0.08]">
                      <motion.a
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="flex items-baseline gap-4 py-4 font-display text-3xl text-cream"
                        initial={calm ? { opacity: 0 } : { y: "110%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        transition={{ duration: calm ? 0.2 : 0.8, delay: 0.16 + i * 0.055, ease: EASE }}
                      >
                        <span className="font-mono text-[0.6rem] text-caramel/70">
                          0{i + 1}
                        </span>
                        {l.label}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </nav>

              <motion.div
                className="mt-8 flex flex-col gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
              >
                <a
                  href={SITE.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-cream px-8 py-3.5 text-center text-sm font-medium text-ink"
                >
                  Get Directions
                </a>
                <a
                  href={SITE.instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full border border-linen/25 px-8 py-3.5 text-center text-sm font-medium text-cream transition-colors hover:border-amber/50 hover:text-amber"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  Instagram {SITE.instagram}
                </a>
                <a
                  href={SITE.phoneHref}
                  className="rounded-full border border-linen/25 px-8 py-3.5 text-center text-sm font-medium text-cream"
                >
                  Call {SITE.phone}
                </a>
                <p className="mt-2 text-center text-xs text-mist/45">{SITE.hours}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
