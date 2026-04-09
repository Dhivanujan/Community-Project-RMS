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
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
          GPA Summary
        </h1>
        <p className="text-slate-500 text-[15px] mt-1">
          Track your academic progress and GPA trends across semesters.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#3856c4] via-[#4a6ad8] to-[#2d47a8] text-white rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
            <TrendingUp className="w-4 h-4" />
            Cumulative GPA
          </div>
          <h2 className="text-4xl font-extrabold">{cumulativeGPA}</h2>
          <p className="text-white/60 text-xs mt-2 font-medium">out of 4.00</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            Total Credits
          </div>
          <h2 className="text-4xl font-extrabold text-slate-800">
            {totalCreditsEarned}
          </h2>
          <p className="text-slate-400 text-xs mt-2 font-medium">
            of {totalCreditsRequired} required
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4" />
            Standing
          </div>
          <h2 className="text-2xl font-extrabold text-emerald-600">
            First Class
          </h2>
          <p className="text-slate-400 text-xs mt-2 font-medium">
            Top 5% of Faculty
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            Dean&apos;s List
          </div>
          <h2 className="text-4xl font-extrabold text-amber-500">
            {deansListCount}
          </h2>
          <p className="text-slate-400 text-xs mt-2 font-medium">
            semesters achieved
          </p>
        </div>
      </div>

      {/* GPA Trend Chart + Credit Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GPA Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-6">
            GPA Trend by Semester
          </h3>
          <div className="flex items-end gap-4 h-48">
            {semesterData.map((sem, i) => {
              const heightPct = (sem.gpa / maxGPA) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  <span className="text-xs font-bold text-[#3856c4] opacity-0 group-hover:opacity-100 transition-opacity">
                    {sem.gpa.toFixed(2)}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-[#3856c4] to-[#6882e0] rounded-t-lg transition-all duration-500 cursor-pointer hover:from-[#2d47a8] hover:to-[#3856c4] relative"
                    style={{ height: `${heightPct}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-semibold pointer-events-none">
                      GPA: {sem.gpa.toFixed(2)} • {sem.credits} credits
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 text-center leading-tight">
                    {sem.name.split(" ")[0]}
                    <br />
                    {sem.name.split(" ")[1]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* GPA guideline */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-[#3856c4] to-[#6882e0]"></div>
              <span className="text-[11px] text-slate-400 font-medium">
                Semester GPA
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-[2px] bg-emerald-400 rounded"></div>
              <span className="text-[11px] text-slate-400 font-medium">
                Cumulative: {cumulativeGPA}
              </span>
            </div>
          </div>
        </div>

        {/* Credit Progress */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-6">
            Credit Progress
          </h3>

          {/* Circular Progress Representation */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="#3856c4"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${
                    (totalCreditsEarned / totalCreditsRequired) * 314
                  } 314`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-slate-800">
                  {Math.round(
                    (totalCreditsEarned / totalCreditsRequired) * 100
                  )}
                  %
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Complete
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Earned</span>
              <span className="font-bold text-slate-800">
                {totalCreditsEarned} credits
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Remaining</span>
              <span className="font-bold text-slate-800">
                {totalCreditsRequired - totalCreditsEarned} credits
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Required</span>
              <span className="font-bold text-slate-800">
                {totalCreditsRequired} credits
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Semester Breakdown Cards */}
      <div>
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
          Semester Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {semesterData.map((sem, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-700 group-hover:text-[#3856c4] transition-colors">
                  {sem.name}
                </h4>
                <span
                  className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-md ${
                    sem.gpa >= 3.7
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-blue-50 text-blue-600 border border-blue-200"
                  }`}
                >
                  {sem.gpa >= 3.7 ? "Dean's List" : "Good Standing"}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-extrabold text-slate-800">
                  {sem.gpa.toFixed(2)}
                </span>
                <span className="text-sm text-slate-400 font-medium">GPA</span>
              </div>
              <div className="flex gap-4 text-xs text-slate-500 font-medium">
                <span>{sem.credits} credits</span>
                <span>•</span>
                <span>{sem.subjects} subjects</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GPA Scale Reference */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
          GPA Scale Reference
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {gpaScale.map((item) => (
            <div
              key={item.grade}
              className="text-center p-3 rounded-lg bg-slate-50 border border-slate-100"
            >
              <span className="text-lg font-extrabold text-[#3856c4]">
                {item.grade}
              </span>
              <p className="text-xs font-bold text-slate-600 mt-1">
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
