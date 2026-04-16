"use client";

import Link from "next/link";
import { GraduationCap, Mail, Phone } from "lucide-react";
import AnimateOnScroll from "../home/AnimateOnScroll";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-50 to-white pt-16 pb-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Branding */}
          <AnimateOnScroll variant="fadeUp" className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <GraduationCap className="text-white w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                SUSL MeritMatrix<span className="text-blue-600">.</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-6 max-w-sm leading-relaxed">
              A dedicated platform for the Faculty of Computing to manage,
              analyze, and present academic results with unparalleled clarity,
              security, and precision.
            </p>
          </AnimateOnScroll>

          {/* Links */}
          <AnimateOnScroll variant="fadeUp" delay={100}>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-slate-900">
              Departments
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  href="#departments"
                  className="hover:text-blue-600 transition-colors duration-300 relative group inline-block"
                >
                  Software Engineering
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link
                  href="#departments"
                  className="hover:text-blue-600 transition-colors duration-300 relative group inline-block"
                >
                  Computing & Info Systems
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link
                  href="#departments"
                  className="hover:text-blue-600 transition-colors duration-300 relative group inline-block"
                >
                  Data Science
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            </ul>
          </AnimateOnScroll>

          {/* Contact & Resources */}
          <AnimateOnScroll variant="fadeUp" delay={200}>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-slate-900">
              Support
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                support@uniinsight.edu
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                +1 (555) 123-4567
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 transition-colors duration-300 relative group inline-block"
                >
                  Faculty Guidelines
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 transition-colors duration-300 relative group inline-block"
                >
                  Privacy Policy
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            </ul>
          </AnimateOnScroll>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
          <p>
            © {new Date().getFullYear()} SUSL MeritMatrix - Faculty of
            Computing. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex gap-6 font-medium">
            <Link
              href="#"
              className="hover:text-slate-700 transition-colors duration-300"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="hover:text-slate-700 transition-colors duration-300"
            >
              Security Architecture
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}