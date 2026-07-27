"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#how-it-works", label: "How It Works" },
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? "glass-strong shadow-lg shadow-black/20 py-3"
          : "bg-black/60 backdrop-blur-md py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-1 group" onClick={() => setMenuOpen(false)}>
          <span className="text-2xl font-bold tracking-tight text-white transition-colors">
            Snap
          </span>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-sp-coral to-sp-magenta bg-clip-text text-transparent">
            Party
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-block text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2"
          >
            Admin Login
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-white bg-gradient-to-r from-sp-coral to-sp-magenta px-4 py-2 sm:px-5 sm:py-2.5 rounded-full hover:shadow-lg hover:shadow-sp-magenta/25 transition-all duration-300 hover:scale-105"
          >
            Start Free
          </Link>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden p-2 -mr-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden glass-strong border-t border-white/10 px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-white/70 hover:text-white py-3 border-b border-white/5"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium text-white/70 hover:text-white py-3 sm:hidden"
          >
            Admin Login
          </Link>
        </div>
      )}
    </nav>
  );
}
