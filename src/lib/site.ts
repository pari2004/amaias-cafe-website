export const SITE = {
  name: "Amaia's Coffee House",
  nameShort: "AMAIA'S",
  nameKannada: "ಅಮಯ್ಯಸ್ ಕಾಫಿ ಹೌಸ್",
  tagline: "Good Coffee. Good Food. Good Vibes.",
  phone: "098806 16510",
  phoneHref: "tel:+919880616510",
  directions: "https://maps.app.goo.gl/beX4qgUygooqHvbu6",
  address: {
    line1: "9 1, 3rd Cross Rd",
    line2: "BTM 2nd Stage, Kuvempu Nagar",
    line3: "BTM Layout",
    line4: "Bengaluru, Karnataka – 560076",
  },
  hours: "Open Daily · Closes at 11:30 PM",
  price: "₹1–₹200 per person",
  rating: "4.9",
  reviewCount: 26,
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Story", href: "#story" },
  { label: "Coffee", href: "#coffee" },
  { label: "Food", href: "#food" },
  { label: "Experience", href: "#experience" },
  { label: "Gallery", href: "#gallery" },
  { label: "Visit", href: "#visit" },
] as const;

export const REVIEWS = [
  {
    quote:
      "Definitely a great place to relax, enjoy good food, and spend some quality time.",
    author: "Anil Gowda",
    role: "Local Guide",
  },
  {
    quote: "Great atmosphere, excellent coffee, and top-notch service.",
    author: "Prathvik Shervegar",
    role: "Google Review",
  },
  {
    quote:
      "The coffee here is excellent, and the overall vibe and decor are really nice.",
    author: "Navinkumar Reddy",
    role: "Google Review",
  },
] as const;
