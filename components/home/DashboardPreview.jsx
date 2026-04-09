"use client";

import { Trophy, TrendingUp, AlertTriangle } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";
import CountUp from "./CountUp";

export default function DashboardPreview() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.015)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <AnimateOnScroll variant="fadeUp" className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Analytics Dashboard
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Academic Performance Overview
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Visualize GPA trends, identify top performers, and monitor academic
            progress across all departments in one unified dashboard.
          </p>
        </AnimateOnScroll>

        {/* Main Card */}
        <AnimateOnScroll variant="scaleIn" duration={900}>
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/40 p-6 md:p-10 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-blue-50/80 to-transparent rounded-full -translate-y-1/2 translate-x-1/3"></div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-10 relative z-10">
              {/* Left: Top Students */}
              <AnimateOnScroll variant="fadeRight" delay={200} className="w-full md:w-1/3">
                <div className="bg-gradient-to-b from-slate-50 to-white rounded-xl p-6 border border-slate-100 h-full">
                  <h4 className="font-bold mb-6 text-sm uppercase text-slate-500 tracking-wider flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Batch Top Performers
                  </h4>

                  <div className="space-y-3">
                    {[
                      { name: "Student A", gpa: "3.92", rank: 1, medal: "🥇" },
                      { name: "Student B", gpa: "3.88", rank: 2, medal: "🥈" },
                      { name: "Student C", gpa: "3.84", rank: 3, medal: "🥉" },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{s.medal}</span>
                          <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                            {s.name}
                          </span>
                        </div>
                        <span className="font-bold text-blue-600 text-sm bg-blue-50 px-2.5 py-0.5 rounded-lg">
                          {s.gpa}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Right Section */}
              <div className="w-full md:w-2/3 flex flex-col gap-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                  <AnimateOnScroll variant="fadeUp" delay={100}>
                    <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-5 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 uppercase font-semibold tracking-wider">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        Avg GPA
                      </div>
                      <CountUp
                        end={3.42}
                        decimals={2}
                        className="text-3xl font-extrabold text-slate-800"
                      />
                    </div>
                  </AnimateOnScroll>

                  <AnimateOnScroll variant="fadeUp" delay={200}>
                    <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-xl p-5 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 uppercase font-semibold tracking-wider">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        First Class Eligible
                      </div>
                      <CountUp
                        end={128}
                        className="text-3xl font-extrabold text-amber-600"
                      />
                    </div>
                  </AnimateOnScroll>

                  <AnimateOnScroll variant="fadeUp" delay={300}>
                    <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-100 rounded-xl p-5 hover:shadow-lg hover:shadow-rose-100/50 transition-all duration-300">
                      <div className="flex items-center gap-2 text-xs text-rose-500 mb-3 uppercase font-semibold tracking-wider">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        At Risk
                      </div>
                      <CountUp
                        end={34}
                        className="text-3xl font-extrabold text-rose-600"
                      />
                    </div>
                  </AnimateOnScroll>
                </div>

                {/* GPA Chart */}
                <AnimateOnScroll variant="fadeUp" delay={400}>
                  <div className="border border-slate-200 rounded-xl p-6 bg-gradient-to-b from-slate-50 to-white">
                    <h5 className="text-sm font-bold text-slate-700 mb-5 uppercase tracking-wider">
                      Batch GPA Distribution
                    </h5>

                    <div className="flex items-end gap-3 h-40">
                      {[
                        { h: 25, label: "<2.0", color: "from-slate-400 to-slate-500" },
                        { h: 40, label: "2.0–2.4", color: "from-blue-300 to-blue-400" },
                        { h: 70, label: "2.5–2.9", color: "from-blue-400 to-blue-500" },
                        { h: 90, label: "3.0–3.4", color: "from-blue-500 to-indigo-500" },
                        { h: 60, label: "3.5+", color: "from-indigo-500 to-violet-500" },
                      ].map((bar, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-0">
                          <div
                            className={`w-full bg-gradient-to-t ${bar.color} rounded-t-lg hover:opacity-80 transition-all duration-300 animate-grow-up cursor-pointer relative group`}
                            style={{
                              height: `${bar.h}%`,
                              animationDelay: `${i * 120}ms`,
                            }}
                          >
                            {/* Tooltip */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-semibold">
                              {bar.h}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between text-xs text-slate-400 mt-3 font-medium">
                      <span>&lt;2.0</span>
                      <span>2.0–2.4</span>
                      <span>2.5–2.9</span>
                      <span>3.0–3.4</span>
                      <span>3.5+</span>
                    </div>
                  </div>
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}