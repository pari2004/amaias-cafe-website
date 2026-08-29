"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Img } from "@/lib/images";
import { EASE } from "@/components/ui/motion";

/**
 * A focus-trapped, keyboard-driven image viewer shared by the food menu
 * chip and the gallery. Scroll is locked while open; Escape closes;
 * arrow keys step through when a sequence is supplied.
 */

export default function Lightbox({
  items,
  index,
  onClose,
  onStep,
  caption,
}: {
  items: Img[];
  index: number | null;
  onClose: () => void;
  onStep?: (next: number) => void;
  caption?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const item = open ? items[index] : null;
  const many = items.length > 1 && !!onStep;

  const step = useCallback(
    (dir: 1 | -1) => {
      if (index === null || !onStep) return;
      onStep((index + dir + items.length) % items.length);
    },
    [index, items.length, onStep]
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("button, [href]");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => panel.current?.querySelector("button")?.focus(), 60);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose, step]);

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          role="dialog"
          aria-modal="true"
          aria-label={caption ?? item.alt}
        >
          <button
            className="absolute inset-0 cursor-zoom-out bg-ink/94 backdrop-blur-xl"
            onClick={onClose}
            aria-label="Close image viewer"
            tabIndex={-1}
          />

          <motion.div
            ref={panel}
            className="relative z-10 flex max-h-full w-full max-w-5xl flex-col items-center"
            initial={{ scale: 0.94, y: 22, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 10, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="relative w-full overflow-hidden rounded-xl bg-espresso ring-1 ring-inset ring-linen/12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.src}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(max-width: 768px) 92vw, 900px"
                    placeholder="blur"
                    blurDataURL={item.blurDataURL}
                    className="max-h-[76svh] w-full object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 flex w-full items-center justify-between gap-4">
              <p className="min-w-0 flex-1 truncate text-xs text-mist/60">{item.alt}</p>
              <div className="flex shrink-0 items-center gap-2">
                {many && (
                  <>
                    <button
                      onClick={() => step(-1)}
                      className="rounded-full border border-linen/20 px-4 py-2 text-xs text-linen/80 transition-colors hover:border-linen/50 hover:text-cream"
                      aria-label="Previous image"
                    >
                      ←
                    </button>
                    <span className="font-mono text-[0.65rem] tabular-nums text-mist/50">
                      {index + 1}/{items.length}
                    </span>
                    <button
                      onClick={() => step(1)}
                      className="rounded-full border border-linen/20 px-4 py-2 text-xs text-linen/80 transition-colors hover:border-linen/50 hover:text-cream"
                      aria-label="Next image"
                    >
                      →
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="rounded-full bg-cream px-5 py-2 text-xs font-medium text-ink transition-transform hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
