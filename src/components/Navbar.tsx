"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong shadow-lg shadow-black/20 py-3"
          : "bg-black/60 backdrop-blur-md py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-2xl font-bold tracking-tight text-white transition-colors">
            Snap
          </span>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-sp-coral to-sp-magenta bg-clip-text text-transparent">
            Party
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#features" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2"
          >
            Admin Login
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-white bg-gradient-to-r from-sp-coral to-sp-magenta px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-sp-magenta/25 transition-all duration-300 hover:scale-105"
          >
            Start Free
          </Link>
        </div>
      </div>
    </nav>
  );
}
