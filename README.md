# Amaia's Coffee House

Marketing site for Amaia's Coffee House — BTM Layout, Bengaluru.
Next.js 16 (App Router) · TypeScript · Tailwind v4 · Framer Motion.

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

---

## ⚠️ Image rule — read before touching the hero

`public/img/menu-poster.webp` is a **price-list poster**. It must never be
used as a hero background, section background, or gallery tile. Its only
appearance is inside the lightbox opened by the "See the full menu" chip
at the foot of the Food section.

The café has **no ambience, interior, exterior or greenery photography** in
this project — every source image is either that menu poster or a studio
food/coffee shot. The hero and the closing CTA therefore *build* their
atmosphere instead of photographing it (roast gradients, drifting light
pools, a rotating crema swirl, a canvas mote field, CSS steam, film
grain), with one heavily desaturated coffee texture sunk far back at ~30%
opacity purely for depth. The Green Escape section draws its foliage as
line-art SVG for the same reason.

If real ambience photography arrives later, swap it into `IMG.heroAtmos`
and raise the opacity in `Hero.tsx` — the built layers are designed to sit
behind a photograph as well as stand in for one.

## Images

- `source-images/` — the 19 original PNGs (~46 MB), kept out of `public/`
  so they are never shipped.
- `public/img/` — optimized WebP derivatives (~4.3 MB total), including
  cinematic crops and colour grades generated from the originals.
- `src/lib/images.ts` — generated manifest: dimensions, inline blur
  placeholders, and alt text for every asset.

## Structure

```
src/
  app/          layout (self-hosted fonts, metadata, JSON-LD), globals.css
  components/   one file per section, each with its own motion language
    ui/         motion primitives, atmosphere (steam/grain/leaves/bloom),
                canvas particles, lightbox
  lib/          images.ts (asset manifest), site.ts (business details)
  fonts/        Fraunces / Inter / Noto Sans Kannada variable woff2
```

Fonts are **self-hosted**, not fetched from Google at build time, so the
project builds offline and ships zero third-party requests.

## Motion

Each section owns a distinct motion language so the scroll never repeats:

| Section          | Language                                              |
| ---------------- | ----------------------------------------------------- |
| Hero             | built scene; three text layers exit at three speeds    |
| Story            | mask wipes + counting statistics                       |
| Coffee           | pinned cross-dissolve sequence through one frame       |
| Food             | bento tiles wiping in from four edges                  |
| Find Your Corner | stacked cinema — scenes slide over each other          |
| Green Escape     | breathing; three depths of foliage, falling leaves     |
| Reviews          | editorial layering on a diagonal                       |
| Gallery          | horizontal band + masonry drifting at per-tile rates   |
| Visit            | address as signage                                     |

### Two rules worth keeping

1. **Never put `whileInView` on an element that hides itself by clipping.**
   A `clipPath: inset(100% …)` reveal, or a line parked below an
   `overflow-hidden` mask, reports an intersection ratio of `0` while
   hidden — so its own threshold can never be met and the reveal
   deadlocks. Observe an unclipped wrapper instead: `useSeen()` in
   `ui/motion.tsx` exists for exactly this.

2. **Keep every scroll-linked `useTransform` input range inside `[0, 1]`.**
   Framer-motion accelerates scroll-linked values through WAAPI, which
   rejects keyframe offsets outside that range and throws, taking the whole
   page down with it.

## Accessibility & performance

- `prefers-reduced-motion` is honoured throughout; `useCalm()` deliberately
  reports `false` on the server *and* the first client render so the two
  passes match and hydration cannot break.
- Canvas particles park themselves when off-screen, on a hidden tab, or
  under reduced motion.
- Lightbox is focus-trapped, Escape-closable, arrow-navigable.
- All images use `next/image` with blur placeholders and explicit `sizes`;
  the page is statically prerendered.
