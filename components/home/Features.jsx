"use client";

import { Calculator, Trophy, Medal, AlertTriangle, ArrowRight } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";
import Link from "next/link";

export default function Features() {
  const features = [
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "GPA Automation",
      desc: "Instantly calculate semester and cumulative GPAs with precision, eliminating manual spreadsheet errors.",
      linkText: "LEARN MORE",
      linkUrl: "#",
      isActive: true,
      iconBg: "bg-primary-50",
      iconColor: "text-primary-600",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Academic Ranking",
      desc: "Automated batch ranking systems to identify top performers across different computing disciplines.",
      linkText: "LEARN MORE",
      linkUrl: "#",
      isActive: true,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      icon: <Medal className="w-6 h-6" />,
      title: "Class Identification",
      desc: "Identify First Class, Second Upper, and other graduation categories automatically.",
      linkText: "LEARN MORE",
      linkUrl: "#",
      isActive: true,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Early Warning System",
      desc: "Detect students at academic risk and notify lecturers for timely intervention.",
      linkText: "ACTIVE FEATURE",
      linkUrl: "#",
      isActive: false,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-500",
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimateOnScroll variant="fadeUp" className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Core Academic Features
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-base leading-relaxed">
            Designed for the Faculty of Computing to streamline result
            management, automate GPA calculations, and identify student
            performance insights.
          </p>
        </AnimateOnScroll>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((opt, i) => (
            <AnimateOnScroll key={i} variant="fadeUp" delay={i * 100} className="h-full">
              <div className="bg-white p-8 flex flex-col h-full border border-slate-100 hover:border-primary-100 hover:shadow-md transition-all duration-300 group rounded-xl">
                {/* Icon Container */}
                <div className={`w-12 h-12 ${opt.iconBg} ${opt.iconColor} rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                  {opt.icon}
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg text-slate-900 mb-3">
                  {opt.title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                  {opt.desc}
                </p>

                {/* Link */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  {opt.isActive ? (
                    <Link
                      href={opt.linkUrl}
                      className="inline-flex items-center gap-2 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-widest group/link"
                    >
                      {opt.linkText}
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {opt.linkText}
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