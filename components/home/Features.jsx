"use client";

import {
  Calculator,
  Trophy,
  Medal,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";
import Link from "next/link";

export default function Features() {
  const features = [
    {
      icon: Calculator,
      title: "GPA Automation",
      desc: "Instantly calculate semester and cumulative GPA with institutional accuracy and zero manual errors.",
      linkText: "View Details",
      isActive: true,
    },
    {
      icon: Trophy,
      title: "Academic Ranking",
      desc: "Automatically rank students across batches based on academic performance metrics.",
      linkText: "View Details",
      isActive: true,
    },
    {
      icon: Medal,
      title: "Class Classification",
      desc: "Identify degree classifications including First Class, Second Upper, and Pass categories.",
      linkText: "View Details",
      isActive: true,
    },
    {
      icon: AlertTriangle,
      title: "Early Warning System",
      desc: "Detect at-risk students early and enable timely academic intervention by faculty.",
      linkText: "System Module",
      isActive: false,
    },
  ];

  return (
    <section
      id="features"
      className="py-24 bg-slate-950 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <AnimateOnScroll variant="fadeUp">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Core Academic System Modules
            </h2>
            <p className="text-white/50 mt-4 max-w-2xl mx-auto text-sm leading-relaxed">
              A centralized academic intelligence system designed to automate
              grading, ranking, and performance analytics for the Faculty of Computing.
            </p>
          </div>
        </AnimateOnScroll>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {features.map((f, i) => (
            <AnimateOnScroll key={i} variant="fadeUp" delay={i * 100}>
              <div className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">

                {/* ICON */}
                <div className="w-11 h-11 rounded-lg bg-blue-500/10 flex items-center justify-center mb-5">
                  <f.icon className="w-5 h-5 text-blue-400" />
                </div>

                {/* TITLE */}
                <h3 className="text-white font-semibold text-lg mb-2">
                  {f.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-white/50 text-sm leading-relaxed">
                  {f.desc}
                </p>

                {/* FOOTER */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  {f.isActive ? (
                    <Link
                      href="#"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider group/link"
                    >
                      {f.linkText}
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <span className="text-xs text-white/30 uppercase tracking-wider">
                      {f.linkText}
                    </span>
                  )}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}