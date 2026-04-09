"use client";

import Link from "next/link";
import { UserCircle, Presentation, ArrowRight, Shield } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-600/5 to-transparent rounded-full"></div>

        {/* Floating dots */}
        <div className="absolute top-16 left-[10%] w-1.5 h-1.5 rounded-full bg-blue-400/30 animate-float-fast"></div>
        <div className="absolute bottom-20 right-[15%] w-2 h-2 rounded-full bg-indigo-400/20 animate-float-slow"></div>
        <div className="absolute top-1/3 right-[25%] w-1 h-1 rounded-full bg-blue-300/40 animate-float"></div>
        <div className="absolute bottom-1/3 left-[20%] w-1.5 h-1.5 rounded-full bg-indigo-300/30 animate-float-fast"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
        {/* Heading */}
        <AnimateOnScroll variant="fadeUp">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Access Your Academic{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Insights
            </span>{" "}
            Instantly
          </h2>
        </AnimateOnScroll>

        {/* Description */}
        <AnimateOnScroll variant="fadeUp" delay={150}>
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Log in to view GPA analytics, track academic performance, and
            identify rankings and graduation eligibility within the Faculty of
            Computing.
          </p>
        </AnimateOnScroll>

        {/* Buttons */}
        <AnimateOnScroll variant="fadeUp" delay={300}>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            {/* Student Login */}
            <Link
              href="/login"
              className="group flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-blue-900/30 hover:shadow-blue-600/40"
            >
              <UserCircle className="w-5 h-5" />
              Student Login
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Faculty Login */}
            <Link
              href="/login"
              className="group flex items-center justify-center gap-2.5 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-slate-900/20 backdrop-blur-sm"
            >
              <Presentation className="w-5 h-5 text-blue-400" />
              Faculty Access
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimateOnScroll>

        {/* Trust Line */}
        <AnimateOnScroll variant="fadeUp" delay={450}>
          <div className="flex items-center justify-center gap-2 mt-10 text-sm text-slate-500">
            <Shield className="w-4 h-4 text-blue-400/60" />
            <p>
              Secure access for students and academic staff of the Faculty of
              Computing
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}