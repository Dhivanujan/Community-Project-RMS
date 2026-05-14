"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import suslLogo from "../home/logo susl.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "Departments", href: "#departments" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-md border-b border-slate-800"
          : "bg-slate-900 border-b border-slate-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
              <Image src={suslLogo} alt="SUSL Logo" fill className="object-contain filter brightness-0 invert" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="font-bold text-base sm:text-lg text-white tracking-tight">
                SUSL Results
              </span>
              <span className="text-[10px] text-slate-400 -mt-0.5">
                Management System
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
            {navItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="relative px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-full transition-all duration-200 hover:bg-slate-700"
              >
                {item.name}
              </Link>
            ))}
            <div className="h-5 w-px bg-slate-700 mx-2"></div>
            <Link
              href="/login"
              className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 shadow-md shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              Login Portal
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all duration-200 shadow-sm"
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5">
              <Menu
                className={`absolute inset-0 transition-all duration-300 ${
                  open ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                }`}
              />
              <X
                className={`absolute inset-0 transition-all duration-300 ${
                  open ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-2 space-y-1">
            {navItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition"
              >
                {item.name}
              </Link>
            ))}
            <div className="h-px w-full bg-slate-800 my-2"></div>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md shadow-blue-500/20 transition hover:shadow-blue-500/40 mx-2"
            >
              Login Portal
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}