"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37a4 4 0 1 1-7.914 1.174 4 4 0 0 1 7.914-1.174z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Our Story", href: "#story" },
    { name: "Menu", href: "#menu" },
    { name: "Experience", href: "#experience" },
    { name: "Gallery", href: "#gallery" },
    { name: "Reviews", href: "#reviews" },
    { name: "Visit Us", href: "#visit" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-white/5 ${
          scrolled ? "bg-black/60 backdrop-blur-md py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-bold tracking-widest text-cream">AMAIA'S</span>
            <span className="text-[10px] md:text-xs text-cream/70 tracking-[0.2em] font-light">COFFEE HOUSE</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-cream/80 hover:text-cream transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cream transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-cream/80 hover:text-cream transition-colors">
              <InstagramIcon className="w-5 h-5" />
            </a>
            <button className="px-6 py-2 bg-cream text-dark font-medium rounded-full hover:bg-beige transition-colors shadow-[0_0_15px_rgba(245,240,235,0.15)]">
              Visit Amaia's
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-cream"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[60] bg-dark/95 backdrop-blur-xl flex flex-col justify-center items-center"
          >
            <button 
              className="absolute top-8 right-8 text-cream"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>
            <div className="flex flex-col items-center space-y-8 text-2xl font-light">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-cream hover:text-beige transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px w-16 bg-white/20 my-4"></div>
              <button className="px-8 py-3 bg-cream text-dark font-medium rounded-full text-lg">
                Visit Amaia's
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
