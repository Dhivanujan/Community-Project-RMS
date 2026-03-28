"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, LogIn, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm shadow-blue-500/20 transition-transform group-hover:scale-105">
              <GraduationCap className="text-white w-6 h-6" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-xl text-slate-900">
                SUSL MeritMatrix<span className="text-blue-600">.</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                SUSL – Faculty of Computing
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#home" className="nav-link">Home</Link>
            <Link href="#features" className="nav-link">Features</Link>
            <Link href="#departments" className="nav-link">Departments</Link>

            <div className="h-6 w-px bg-slate-200"></div>

            <Link
              href="#login"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:-translate-y-0.5 hover:shadow-md shadow-blue-600/20"
            >
              <LogIn className="w-4 h-4" />
              Login Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg border border-slate-200"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-6 animate-fadeInUp">
            <div className="flex flex-col gap-4 mt-4">
              <Link href="#home" className="mobile-link">Home</Link>
              <Link href="#features" className="mobile-link">Features</Link>
              <Link href="#departments" className="mobile-link">Departments</Link>

              <Link
                href="#login"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium mt-2"
              >
                <LogIn className="w-4 h-4" />
                Login Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}