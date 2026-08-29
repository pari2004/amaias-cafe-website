"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center scale-105 transform transition-transform duration-[20s] ease-linear hover:scale-110"
        style={{ backgroundImage: "url('/img-1.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
      </div>

      {/* Particles/Grain Effect */}
      <div className="absolute inset-0 z-10 bg-grain pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 md:px-12 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-cream mb-6 tracking-tight drop-shadow-lg">
            Coffee. Comfort. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream to-beige">Conversations.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg md:text-2xl text-cream/90 max-w-2xl font-light mb-12 drop-shadow-md"
        >
          A cozy corner in Bengaluru where every cup feels like home.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <button className="px-8 py-4 bg-cream text-dark font-medium rounded-full hover:bg-beige hover:scale-105 transition-all shadow-[0_0_20px_rgba(245,240,235,0.2)]">
            Explore Our Menu
          </button>
          <button className="px-8 py-4 bg-transparent border border-cream/50 text-cream font-medium rounded-full hover:bg-cream/10 transition-all backdrop-blur-sm">
            Visit the Café
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce"
      >
        <span className="text-cream/60 text-xs tracking-widest uppercase mb-2">Scroll</span>
        <ChevronDown className="w-5 h-5 text-cream/60" />
      </motion.div>
    </section>
  );
}
