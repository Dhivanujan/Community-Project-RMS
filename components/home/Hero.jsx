"use client";

import Link from "next/link";
import { ArrowRight, Activity, TrendingUp, Trophy, Users, BookOpen, Sparkles } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

export default function Hero() {
  return (
    <section id="home" className="relative bg-white overflow-hidden pt-16 pb-28 lg:pt-24 lg:pb-36">
      {/* ── Animated background blobs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-100 via-indigo-50 to-transparent rounded-full blur-3xl opacity-70 animate-float-slow"></div>
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-100 via-blue-50 to-transparent rounded-full blur-3xl opacity-50 animate-float"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-50/50 to-transparent rounded-full"></div>

        {/* Decorative geometric shapes */}
        <div className="absolute top-20 left-[15%] w-3 h-3 rounded-full bg-blue-300/40 animate-float-fast"></div>
        <div className="absolute top-40 right-[20%] w-2 h-2 rounded-full bg-indigo-300/50 animate-float-slow"></div>
        <div className="absolute bottom-32 left-[30%] w-4 h-4 rounded-sm bg-blue-200/30 animate-float rotate-45"></div>
        <div className="absolute top-1/3 right-[10%] w-2 h-2 rounded-full bg-blue-400/30 animate-float"></div>
        <div className="absolute bottom-20 right-[35%] w-3 h-3 rounded-full bg-indigo-200/40 animate-float-fast"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Side Content */}
          <div className="flex-1 text-center lg:text-left">
            <AnimateOnScroll variant="fadeUp" delay={0} duration={800}>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 shadow-sm">
                <Sparkles className="w-4 h-4" />
                Sabaragamuwa University of Sri Lanka
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeUp" delay={100} duration={800}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                Smart Results{" "}
                <br className="hidden lg:block" />
                Management for{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                  SUSL
                </span>
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeUp" delay={200} duration={800}>
              <p className="text-lg sm:text-xl text-slate-600 font-medium mb-4 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Automate GPA calculations, track academic performance, and
                identify top achievers with an intelligent results management
                system.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeUp" delay={300} duration={800}>
              <p className="text-base text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Designed for the Faculty of Computing to support Software
                Engineering, Computing & Information Systems, and Data Science
                departments.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll variant="fadeUp" delay={400} duration={800}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/login"
                  className="group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 animate-pulse-glow"
                >
                  Login Portal
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link
                  href="#features"
                  className="flex items-center justify-center bg-white border-2 border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Explore Features
                </Link>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Right Side Visual */}
          <div className="flex-1 w-full max-w-xl lg:max-w-2xl">
            <AnimateOnScroll variant="fadeLeft" delay={200} duration={1000}>
              <div className="relative">
                {/* Glow behind card */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100 rounded-3xl blur-2xl opacity-60 animate-float-slow"></div>

                <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-200/60 p-2 border border-slate-100/80">
                  <div className="bg-gradient-to-b from-slate-50 to-white rounded-xl overflow-hidden border border-slate-100">
                    {/* Mockup Header */}
                    <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-300/70"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-300/70"></div>
                        <div className="w-3 h-3 rounded-full bg-green-300/70"></div>
                      </div>
                      <div className="bg-slate-50 px-4 py-1.5 rounded-lg flex-1 text-center text-[11px] font-semibold text-slate-400 border border-slate-100 truncate">
                        meritmatrix.susl.lk/dashboard
                      </div>
                    </div>

                    {/* Mockup Content */}
                    <div className="p-5 flex flex-col gap-5">
                      {/* Top Stats Cards */}
                      <div className="grid grid-cols-3 gap-3 sm:gap-4">
                        {[
                          {
                            label: "Overall GPA",
                            val: "3.42",
                            icon: Activity,
                            color: "text-blue-600",
                            bg: "bg-blue-50",
                            border: "border-blue-100",
                          },
                          {
                            label: "Total Students",
                            val: "850",
                            icon: Users,
                            color: "text-indigo-600",
                            bg: "bg-indigo-50",
                            border: "border-indigo-100",
                          },
                          {
                            label: "Active Courses",
                            val: "42",
                            icon: BookOpen,
                            color: "text-emerald-600",
                            bg: "bg-emerald-50",
                            border: "border-emerald-100",
                          },
                        ].map((stat, i) => (
                          <div
                            key={i}
                            className={`p-3 sm:p-4 rounded-xl bg-white border ${stat.border} shadow-sm flex flex-col gap-2 sm:gap-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}
                          >
                            <div
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${stat.bg}`}
                            >
                              <stat.icon
                                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${stat.color}`}
                              />
                            </div>
                            <div>
                              <div className="text-lg sm:text-xl font-bold text-slate-800">
                                {stat.val}
                              </div>
                              <div className="text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                {stat.label}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                        {/* Bar Chart Section */}
                        <div className="sm:col-span-7 bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex flex-col">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                              Performance Trend
                            </span>
                            <TrendingUp className="w-4 h-4 text-slate-300" />
                          </div>
                          {/* Bar Chart */}
                          <div className="flex items-end gap-2 h-28 w-full mt-auto mb-2 px-1">
                            {[
                              { h: 35, label: "Y1S1" },
                              { h: 50, label: "Y1S2" },
                              { h: 42, label: "Y2S1" },
                              { h: 65, label: "Y2S2" },
                              { h: 55, label: "Y3S1" },
                              { h: 80, label: "Y3S2" },
                              { h: 72, label: "Y4S1" },
                            ].map((bar, i) => (
                              <div
                                key={i}
                                className="flex-1 flex flex-col items-center gap-1"
                              >
                                <div
                                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-500 hover:from-blue-700 hover:to-blue-500 animate-grow-up"
                                  style={{
                                    height: `${bar.h}%`,
                                    animationDelay: `${i * 100}ms`,
                                  }}
                                ></div>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between w-full px-1 text-[8px] sm:text-[9px] font-bold text-slate-300 mt-1">
                            <span>Y1S1</span>
                            <span>Y1S2</span>
                            <span>Y2S1</span>
                            <span>Y2S2</span>
                            <span>Y3S1</span>
                            <span>Y3S2</span>
                            <span>Y4S1</span>
                          </div>
                        </div>

                        {/* Leaderboard Section */}
                        <div className="sm:col-span-5 bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex flex-col">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                              Top Rankers
                            </span>
                            <Trophy className="w-4 h-4 text-amber-400" />
                          </div>
                          <div className="space-y-3 flex-1 justify-center flex flex-col">
                            {[
                              {
                                rank: 1,
                                name: "John Doe",
                                gpa: "3.98",
                                badge: "bg-amber-50 text-amber-600 border-amber-200",
                              },
                              {
                                rank: 2,
                                name: "Alice Smith",
                                gpa: "3.95",
                                badge: "bg-slate-50 text-slate-500 border-slate-200",
                              },
                              {
                                rank: 3,
                                name: "Emma Watson",
                                gpa: "3.91",
                                badge: "bg-orange-50 text-orange-600 border-orange-200",
                              },
                            ].map((student, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${student.badge}`}
                                  >
                                    {student.rank}
                                  </div>
                                  <span className="text-xs font-semibold text-slate-600">
                                    {student.name}
                                  </span>
                                </div>
                                <span className="text-xs font-bold text-blue-600">
                                  {student.gpa}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
