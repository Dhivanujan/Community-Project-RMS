"use client";

import { Calculator, Trophy, Medal, AlertTriangle } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

export default function Features() {
  const features = [
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "GPA Automation",
      desc: "Instantly calculate semester and cumulative GPAs with precision, eliminating manual spreadsheet errors.",
      gradient: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
      glow: "group-hover:shadow-blue-500/20",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Academic Ranking",
      desc: "Automated batch ranking systems to identify top performers across different computing disciplines.",
      gradient: "from-indigo-500 to-violet-500",
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-100",
      glow: "group-hover:shadow-indigo-500/20",
    },
    {
      icon: <Medal className="w-6 h-6" />,
      title: "Class Identification",
      desc: "Identify First Class, Second Upper, and other graduation categories automatically.",
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
      glow: "group-hover:shadow-emerald-500/20",
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Early Warning System",
      desc: "Detect students at academic risk and notify lecturers for timely intervention.",
      gradient: "from-rose-500 to-pink-500",
      bg: "bg-rose-50",
      text: "text-rose-600",
      border: "border-rose-100",
      glow: "group-hover:shadow-rose-500/20",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <AnimateOnScroll variant="fadeUp" className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Capabilities
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Core Academic Features
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Designed for the Faculty of Computing to streamline result
            management, automate GPA calculations, and identify student
            performance insights.
          </p>
        </AnimateOnScroll>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((opt, i) => (
            <AnimateOnScroll key={i} variant="fadeUp" delay={i * 120}>
              <div
                className={`relative bg-white hover:bg-gradient-to-b hover:from-white hover:to-slate-50/50 p-8 rounded-2xl border ${opt.border} shadow-sm hover:shadow-xl ${opt.glow} transition-all duration-500 group cursor-pointer overflow-hidden`}
              >
                {/* Top accent line */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${opt.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                ></div>

                {/* Icon */}
                <div
                  className={`w-14 h-14 ${opt.bg} ${opt.text} rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg`}
                >
                  {opt.icon}
                </div>

                {/* Title */}
                <h3 className="font-bold text-xl text-slate-900 mb-3 group-hover:text-slate-800 transition-colors">
                  {opt.title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-sm leading-relaxed">
                  {opt.desc}
                </p>

                {/* Hover arrow */}
                <div className="mt-5 flex items-center gap-1 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span className={opt.text}>Learn more</span>
                  <svg className={`w-4 h-4 ${opt.text} transition-transform group-hover:translate-x-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}