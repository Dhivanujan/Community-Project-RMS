"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap, LogIn, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-200/40 border-b border-slate-200/60"
          : "bg-white/60 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25 transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-600/40 group-hover:rotate-3">
              <GraduationCap className="text-white w-6 h-6" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                SUSL MeritMatrix
                <span className="text-primary-600">.</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 uppercase tracking-[0.2em]">
                Faculty of Computing
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#home" className="nav-link">
              Home
            </Link>
            <Link href="#features" className="nav-link">
              Features
            </Link>
            <Link href="#departments" className="nav-link">
              Departments
            </Link>

            <div className="h-6 w-px bg-slate-200"></div>

            <Link
              href="/login"
              className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
            >
              <LogIn className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              Login Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5">
              <Menu
                className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
                  open ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                }`}
              />
              <X
                className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
                  open ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-6 animate-slideDown shadow-xl rounded-b-2xl border-t border-slate-100 bg-white/95 backdrop-blur-xl absolute left-0 right-0 px-4 z-40">
            <div className="flex flex-col gap-2 mt-4">
              <Link href="#home" className="py-3 px-4 rounded-xl hover:bg-primary-50 text-slate-600 hover:text-primary-600 font-medium transition-colors" onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link href="#features" className="py-3 px-4 rounded-xl hover:bg-primary-50 text-slate-600 hover:text-primary-600 font-medium transition-colors" onClick={() => setOpen(false)}>
                Features
              </Link>
              <Link href="#departments" className="py-3 px-4 rounded-xl hover:bg-primary-50 text-slate-600 hover:text-primary-600 font-medium transition-colors" onClick={() => setOpen(false)}>
                Departments
              </Link>

              <div className="h-px w-full bg-slate-100 my-2"></div>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white px-6 py-3.5 rounded-xl font-semibold mt-1 shadow-lg shadow-blue-600/20 transition-all"
                onClick={() => setOpen(false)}
              >
                <LogIn className="w-5 h-5" />
                Login Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}