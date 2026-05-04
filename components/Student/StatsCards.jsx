"use client";

import { TrendingUp, CheckCircle, ClipboardList, ArrowUpRight } from "lucide-react";

export default function StatsCards({ data }) {
  const gpa = data?.cumulativeGpa || 0;
  const completed = data?.publishedResults || 0;
  const total = data?.totalSubjects || 0;
  const pending = data?.pendingResults || 0;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Academic Standing — GPA Card */}
      <div className="relative bg-gradient-to-br from-primary-900 via-[#264d7a] to-[#1a3355] text-white rounded-2xl p-6 overflow-hidden shadow-lg shadow-[primary-900]/15 group hover:shadow-xl hover:shadow-[primary-900]/20 transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/[0.04] rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/[0.03] rounded-full" />
        <div className="absolute top-4 right-4 w-16 h-16 bg-white/[0.02] rounded-full" />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 bg-white/[0.12] backdrop-blur-sm text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-md mb-4">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            Academic Standing
          </span>
          <p className="text-white/60 text-xs font-medium mb-1 tracking-wide">
            Current Cumulative GPA
          </p>
          <div className="flex items-baseline gap-2 mb-3">
            <h2 className="text-[48px] font-extrabold leading-none tracking-tight">
              {gpa.toFixed(2)}
            </h2>
            <span className="text-white/40 text-sm font-semibold">/ 4.00</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-300/90 text-xs font-semibold">
            <div className="flex items-center gap-1 bg-emerald-400/[0.15] px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3" />
              <span>+0.05</span>
            </div>
            <span className="text-white/50">Top 5% of Faculty</span>
          </div>
        </div>
      </div>

      {/* Completed Subjects */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
            Completed Subjects
          </p>
          <div className="w-9 h-9 rounded-lg bg-primary-900/[0.07] flex items-center justify-center group-hover:bg-primary-900/[0.10] transition-colors">
            <CheckCircle className="w-4 h-4 text-primary-900" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mb-3">
          <h2 className="text-[38px] font-extrabold text-slate-800 leading-none tracking-tight">
            {completed}
          </h2>
          <span className="text-base text-slate-400 font-medium">/ {total}</span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
          <div
            className="bg-gradient-to-r from-primary-900 to-primary-600 h-1.5 rounded-full transition-all duration-1000"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 font-medium">{completionPercentage}% program completion</p>
      </div>

      {/* Pending Results */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
            Pending Results
          </p>
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center group-hover:bg-amber-100/80 transition-colors">
            <ClipboardList className="w-4 h-4 text-amber-600" />
          </div>
        </div>
        <h2 className="text-[38px] font-extrabold text-slate-800 leading-none tracking-tight mb-3">
          {pending < 10 && pending > 0 ? `0${pending}` : pending}
        </h2>
        <a
          href="/student/results"
          className="inline-flex items-center gap-1 text-primary-900 text-xs font-semibold hover:text-primary-600 transition-colors group/link"
        >
          View pending subjects
          <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}
