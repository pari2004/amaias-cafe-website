import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/* Self-hosted variable fonts — no external requests, no runtime deps. */

const fraunces = localFont({
  src: "../fonts/Fraunces-Variable.woff2",
  variable: "--font-fraunces",
  weight: "300 800",
  display: "swap",
  preload: true,
});

const inter = localFont({
  src: "../fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  weight: "300 700",
  display: "swap",
  preload: true,
});

const kannada = localFont({
  src: "../fonts/NotoSansKannada-Variable.woff2",
  variable: "--font-kannada",
  weight: "400 700",
  display: "swap",
  preload: false,
});

const SITE = "https://amaiacoffeehouse.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Amaia's Coffee House · BTM Layout, Bengaluru",
    template: "%s · Amaia's Coffee House",
  },
  description:
    "Good Coffee. Good Food. Good Vibes. A cozy corner in BTM Layout, Bengaluru where every cup feels like home. Filter coffee, espresso, cold brews, sandwiches and snacks. Open daily until 11:30 PM.",
  keywords: [
    "Amaia's Coffee House",
    "cafe in BTM Layout",
    "coffee shop Bengaluru",
    "filter coffee Bangalore",
    "BTM 2nd Stage cafe",
    "best cafe Kuvempu Nagar",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE,
    siteName: "Amaia's Coffee House",
    title: "Amaia's Coffee House · BTM Layout, Bengaluru",
    description:
      "Coffee. Comfort. Conversations. A cozy corner in Bengaluru where every cup feels like home.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amaia's Coffee House · BTM Layout, Bengaluru",
    description: "Good Coffee. Good Food. Good Vibes.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0706",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: "Amaia's Coffee House",
  alternateName: "ಅಮಯ್ಯಸ್ ಕಾಫಿ ಹೌಸ್",
  slogan: "Good Coffee. Good Food. Good Vibes.",
  servesCuisine: ["Coffee", "Cafe", "Snacks", "Sandwiches"],
  priceRange: "₹1–₹200",
  telephone: "+919880616510",
  address: {
    "@type": "PostalAddress",
    streetAddress: "9 1, 3rd Cross Rd, BTM 2nd Stage, Kuvempu Nagar, BTM Layout",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "560076",
    addressCountry: "IN",
  },
  hasMap: "https://maps.app.goo.gl/beX4qgUygooqHvbu6",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "26",
    bestRating: "5",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "23:30",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${inter.variable} ${kannada.variable}`}>
      <body className="bg-ink text-cream font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
