"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

          {/* LEFT - BRAND */}
          <div>
            <h3 className="text-white font-semibold text-lg">
              SUSL Academic Portal
            </h3>

            <p className="text-white/50 text-sm mt-3 leading-relaxed">
              Results Management System for the Faculty of Computing,
              Sabaragamuwa University of Sri Lanka. Secure academic data
              processing and performance analytics platform.
            </p>
          </div>

          {/* CENTER - LINKS */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">
              System Links
            </h4>

            <div className="flex flex-col gap-2 text-sm text-white/50">
              <Link href="#" className="hover:text-white transition">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-white transition">
                Contact Support
              </Link>
              <Link href="#" className="hover:text-white transition">
                Academic Regulations
              </Link>
            </div>
          </div>

          {/* RIGHT - SYSTEM STATUS */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wider">
              System Status
            </h4>

            <div className="space-y-2 text-sm text-white/50">
              <p>🟢 Online - Core Services Active</p>
              <p>🔒 Secure Authentication Enabled</p>
              <p>⚡ GPA Engine Running</p>
              <p className="text-xs mt-3 text-white/30">
                © {new Date().getFullYear()} Sabaragamuwa University of Sri Lanka
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-white/30">
          Authorized access only for students and academic staff
        </div>

      </div>
    </footer>
  );
}