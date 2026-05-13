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
          ? "bg-white/80 backdrop-blur-xl shadow-md border-b border-slate-200/60"
          : "bg-white border-b border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
              <Image src={suslLogo} alt="SUSL Logo" fill className="object-contain" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="font-bold text-lg sm:text-xl text-slate-800 tracking-tight">
                SUSL Results
              </span>
              <span className="text-xs text-slate-500 -mt-0.5">
                Management System
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full border border-slate-200">
            {navItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-full transition-all duration-200 hover:bg-white"
              >
                {item.name}
              </Link>
            ))}
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            <Link
              href="/login"
              className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-full font-semibold transition-all duration-300 shadow-md shadow-blue-600/20 hover:shadow-blue-600/40"
            >
              Login Portal
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-200 shadow-sm"
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
            open ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-3 space-y-2">
            {navItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-slate-100 transition"
              >
                {item.name}
              </Link>
            ))}
            <div className="h-px w-full bg-slate-100 my-2"></div>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-xl font-semibold shadow-md shadow-blue-600/20 transition hover:shadow-blue-600/40"
            >
              Login Portal
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}