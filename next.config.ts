import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Source art is already WebP; AVIF gives another meaningful cut.
    formats: ["image/avif", "image/webp"],
    // Qualities used across the site (atmospheric layers ship lighter).
    qualities: [70, 75, 90],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920],
  },
};

export default nextConfig;
