"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          {/* Left: Branding + copyright */}
          <div>
            <p className="font-bold text-slate-800 mb-0.5">SUSL Results Management</p>
            <p className="text-xs">
              © {new Date().getFullYear()} Sabaragamuwa University of Sri Lanka. All Rights Reserved.
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-6 text-xs font-medium">
            <Link href="#" className="hover:text-slate-800 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-slate-800 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-slate-800 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
