"use client";

import { TrendingUp, Award, BookOpen, GraduationCap } from "lucide-react";

const semesterData = [
  { name: "Fall 2022", gpa: 3.65, credits: 12, subjects: 4 },
  { name: "Spring 2023", gpa: 3.72, credits: 14, subjects: 5 },
  { name: "Fall 2023", gpa: 3.78, credits: 11, subjects: 4 },
  { name: "Spring 2024", gpa: 3.85, credits: 12, subjects: 4 },
  { name: "Fall 2024", gpa: 3.92, credits: 7, subjects: 2 },
];

const gpaScale = [
  { grade: "A+", range: "4.00", desc: "Exceptional" },
  { grade: "A", range: "4.00", desc: "Excellent" },
  { grade: "A-", range: "3.70", desc: "Very Good" },
  { grade: "B+", range: "3.30", desc: "Good" },
  { grade: "B", range: "3.00", desc: "Above Average" },
  { grade: "B-", range: "2.70", desc: "Average" },
  { grade: "C+", range: "2.30", desc: "Below Average" },
  { grade: "C", range: "2.00", desc: "Satisfactory" },
];

export default function GPASummaryPage() {
  const maxGPA = 4.0;
  const cumulativeGPA = 3.82;
  const totalCreditsEarned = 56;
  const totalCreditsRequired = 128;
  const deansListCount = 3;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          GPA Summary
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Track your academic progress and GPA trends across semesters.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#1e3a5f] via-[#264d7a] to-[#163050] text-white rounded-xl p-5 relative overflow-hidden shadow-sm shadow-[#1e3a5f]/10">
          <div className="absolute -top-5 -right-5 w-20 h-20 bg-white/[0.04] rounded-full" />
          <div className="relative">
            <div className="flex items-center gap-1.5 text-white/50 text-[10px] font-bold uppercase tracking-[0.12em] mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              Cumulative GPA
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">{cumulativeGPA}</h2>
            <p className="text-white/40 text-xs mt-1.5 font-medium">out of 4.00</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-[0.12em] mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Total Credits
          </div>
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            {totalCreditsEarned}
          </h2>
          <p className="text-slate-400 text-xs mt-1.5 font-medium">
            of {totalCreditsRequired} required
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-[0.12em] mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            Standing
          </div>
          <h2 className="text-2xl font-extrabold text-emerald-600 tracking-tight">
            First Class
          </h2>
          <p className="text-slate-400 text-xs mt-1.5 font-medium">
            Top 5% of Faculty
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-[0.12em] mb-2">
            <Award className="w-3.5 h-3.5" />
            Dean&apos;s List
          </div>
          <h2 className="text-4xl font-extrabold text-[#d4a843] tracking-tight">
            {deansListCount}
          </h2>
          <p className="text-slate-400 text-xs mt-1.5 font-medium">
            semesters achieved
          </p>
        </div>
      </div>

      {/* GPA Trend Chart + Credit Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* GPA Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.1em] mb-6">
            GPA Trend by Semester
          </h3>
          <div className="flex items-end gap-4 h-44">
            {semesterData.map((sem, i) => {
              const heightPct = ((sem.gpa - 3.0) / (maxGPA - 3.0)) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <span className="text-xs font-bold text-[#1e3a5f] opacity-0 group-hover:opacity-100 transition-opacity">
                    {sem.gpa.toFixed(2)}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-[#1e3a5f] to-[#3d6a99] rounded-t-lg transition-all duration-500 cursor-pointer hover:from-[#163050] hover:to-[#2d5a8e] relative"
                    style={{ height: `${heightPct}%`, minHeight: "12px" }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-semibold pointer-events-none">
                      {sem.gpa.toFixed(2)} • {sem.credits}cr
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 text-center leading-tight">
                    {sem.name.split(" ")[0]}
                    <br />
                    {sem.name.split(" ")[1]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100/60">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#1e3a5f] to-[#3d6a99]" />
              <span className="text-[11px] text-slate-400 font-medium">
                Semester GPA
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-[2px] bg-emerald-400/80 rounded" />
              <span className="text-[11px] text-slate-400 font-medium">
                Cumulative: {cumulativeGPA}
              </span>
            </div>
          </div>
        </div>

        {/* Credit Progress */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.1em] mb-6">
            Credit Progress
          </h3>

          {/* Circular Progress */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="url(#creditGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${
                    (totalCreditsEarned / totalCreditsRequired) * 314
                  } 314`}
                />
                <defs>
                  <linearGradient id="creditGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1e3a5f" />
                    <stop offset="100%" stopColor="#3d6a99" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
                  {Math.round(
                    (totalCreditsEarned / totalCreditsRequired) * 100
                  )}
                  %
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  Complete
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { label: "Earned", value: `${totalCreditsEarned} credits` },
              { label: "Remaining", value: `${totalCreditsRequired - totalCreditsEarned} credits` },
              { label: "Required", value: `${totalCreditsRequired} credits` },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-[13px]">
                <span className="text-slate-400 font-medium">{item.label}</span>
                <span className="font-semibold text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Semester Breakdown Cards */}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.1em] mb-4">
          Semester Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {semesterData.map((sem, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-700 group-hover:text-[#1e3a5f] transition-colors">
                  {sem.name}
                </h4>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                    sem.gpa >= 3.7
                      ? "bg-[#d4a843]/10 text-[#b8912e] border border-[#d4a843]/20"
                      : "bg-blue-50 text-blue-600 border border-blue-200/60"
                  }`}
                >
                  {sem.gpa >= 3.7 ? "Dean's List" : "Good Standing"}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-2.5">
                <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
                  {sem.gpa.toFixed(2)}
                </span>
                <span className="text-sm text-slate-400 font-medium">GPA</span>
              </div>
              <div className="flex gap-3 text-[11px] text-slate-400 font-medium">
                <span>{sem.credits} credits</span>
                <span className="text-slate-200">•</span>
                <span>{sem.subjects} subjects</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GPA Scale Reference */}
      <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.1em] mb-4">
          GPA Scale Reference
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {gpaScale.map((item) => (
            <div
              key={item.grade}
              className="text-center p-3 rounded-lg bg-slate-50/80 border border-slate-100/80 hover:border-[#1e3a5f]/15 hover:bg-[#1e3a5f]/[0.02] transition-all"
            >
              <span className="text-lg font-extrabold text-[#1e3a5f]">
                {item.grade}
              </span>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                {item.range}
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
