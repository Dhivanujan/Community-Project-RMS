"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Bell, Settings, User } from "lucide-react";
import suslLogo from "../home/logo susl.png";

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
          : "bg-white border-b border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 transition-all duration-300 group-hover:scale-110">
              <Image src={suslLogo} alt="SUSL Logo" fill className="object-contain" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-lg sm:text-xl text-primary-700 tracking-tight">
                SUSL Results Management
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#dashboard" className="nav-link relative text-primary-700 font-semibold pb-1">
              Dashboard
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></span>
            </Link>
            <Link href="#departments" className="nav-link text-slate-500 hover:text-slate-900 font-medium transition-colors">
              Departments
            </Link>
            <Link href="#results" className="nav-link text-slate-500 hover:text-slate-900 font-medium transition-colors">
              Results
            </Link>
            <Link href="#profile" className="nav-link text-slate-500 hover:text-slate-900 font-medium transition-colors">
              Profile
            </Link>
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center gap-4 text-slate-600">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300">
               <User className="w-5 h-5 text-slate-500" />
            </div>
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
              <Link href="#dashboard" className="py-3 px-4 rounded-xl hover:bg-primary-50 text-primary-700 font-semibold transition-colors" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <Link href="#departments" className="py-3 px-4 rounded-xl hover:bg-primary-50 text-slate-600 hover:text-primary-600 font-medium transition-colors" onClick={() => setOpen(false)}>
                Departments
              </Link>
              <Link href="#results" className="py-3 px-4 rounded-xl hover:bg-primary-50 text-slate-600 hover:text-primary-600 font-medium transition-colors" onClick={() => setOpen(false)}>
                Results
              </Link>
              <Link href="#profile" className="py-3 px-4 rounded-xl hover:bg-primary-50 text-slate-600 hover:text-primary-600 font-medium transition-colors" onClick={() => setOpen(false)}>
                Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}