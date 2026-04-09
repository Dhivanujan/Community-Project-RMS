"use client";

import { TrendingUp, CheckCircle, ClipboardList } from "lucide-react";

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Academic Standing — GPA Card */}
      <div className="relative bg-gradient-to-br from-[#3856c4] via-[#4a6ad8] to-[#2d47a8] text-white rounded-2xl p-7 overflow-hidden shadow-lg shadow-[#3856c4]/20">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full"></div>

        <span className="inline-block bg-white/20 backdrop-blur-sm text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Academic Standing
        </span>
        <p className="text-white/80 text-sm font-medium mb-1">
          Current Cumulative GPA
        </p>
        <h2 className="text-[52px] font-extrabold leading-none tracking-tight mb-4">
          3.82
        </h2>
        <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
          <TrendingUp className="w-4 h-4" />
          <span>Top 5% of Faculty</span>
        </div>
      </div>

      {/* Completed Subjects */}
      <div className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-5">
          <p className="text-slate-500 text-sm font-medium">
            Completed Subjects
          </p>
          <div className="w-10 h-10 rounded-xl bg-[#3856c4]/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-[#3856c4]" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mb-4">
          <h2 className="text-[42px] font-extrabold text-slate-800 leading-none tracking-tight">
            24
          </h2>
          <span className="text-lg text-slate-400 font-medium">/ 32</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-[#3856c4] h-2 rounded-full transition-all duration-1000"
            style={{ width: "75%" }}
          ></div>
        </div>
      </div>

      {/* Pending Results */}
      <div className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-5">
          <p className="text-slate-500 text-sm font-medium">Pending Results</p>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-amber-500" />
          </div>
        </div>
        <h2 className="text-[42px] font-extrabold text-slate-800 leading-none tracking-tight mb-4">
          03
        </h2>
        <a
          href="/student/results"
          className="text-[#3856c4] text-sm font-semibold hover:underline inline-flex items-center gap-1 group"
        >
          View expectations
          <span className="group-hover:translate-x-0.5 transition-transform">
            →
          </span>
        </a>
      </div>
    </div>
  );
}
