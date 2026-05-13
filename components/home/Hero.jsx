"use client";

import Link from "next/link";
import AnimateOnScroll from "./AnimateOnScroll";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative bg-primary-900 overflow-hidden flex items-center justify-center min-h-[88vh] py-24 lg:py-32"
    >
      {/* ── Background: subtle vertical grid lines ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Vertical lines evenly spaced */}
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-white/10"
            style={{ left: `${(i + 1) * (100 / 8)}%` }}
          />
        ))}
        {/* Top-to-bottom gradient overlay to darken the top */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/10" />
        {/* Radial glow in centre */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
      </div>

      {/* ── Main content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">

        {/* University name */}
        <AnimateOnScroll variant="fadeUp" delay={0} duration={800}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white tracking-[0.12em] uppercase leading-tight mb-3">
            Sabaragamuwa University
            <br />
            <span className="tracking-[0.18em]">of Sri Lanka</span>
          </h1>
        </AnimateOnScroll>

        {/* Sub-heading */}
        <AnimateOnScroll variant="fadeUp" delay={120} duration={800}>
          <p className="text-base sm:text-lg text-primary-200 font-medium tracking-widest uppercase mb-12">
            Results Management System &nbsp;·&nbsp; Faculty of Computing
          </p>
        </AnimateOnScroll>

        {/* ── Login Card ── */}
        <AnimateOnScroll variant="fadeUp" delay={240} duration={800}>
          <div className="relative bg-white/[0.07] border border-white/20 rounded-2xl px-8 py-10 sm:px-14 sm:py-14 backdrop-blur-md shadow-[0_8px_60px_rgba(0,0,0,0.4)]">

            {/* Thin top accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full" />

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
              Access Your Academic Insights Instantly
            </h2>
            <p className="text-primary-200 text-sm sm:text-base mb-10 max-w-xl mx-auto leading-relaxed">
              Log in to view GPA analytics, track academic performance, and
              identify rankings and graduation eligibility within the Faculty
              of Computing.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/login?type=student"
                className="w-full sm:w-auto bg-white text-primary-900 px-10 py-3.5 rounded-lg font-bold tracking-wider text-sm hover:bg-slate-100 active:scale-[0.98] transition-all duration-200 shadow-lg"
              >
                STUDENT LOGIN
              </Link>
              <Link
                href="/login?type=faculty"
                className="w-full sm:w-auto bg-transparent border-2 border-white/70 text-white px-10 py-3.5 rounded-lg font-bold tracking-wider text-sm hover:bg-white/10 hover:border-white active:scale-[0.98] transition-all duration-200"
              >
                FACULTY ACCESS
              </Link>
            </div>

            <p className="text-white/50 text-xs italic">
              Secure access for students and academic staff of the Faculty of Computing
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
