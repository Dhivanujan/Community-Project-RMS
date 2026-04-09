"use client";

import { useState } from "react";
import { Search, Filter, Download, ChevronDown } from "lucide-react";

const semesters = [
  "Fall 2024",
  "Spring 2024",
  "Fall 2023",
  "Spring 2023",
  "Fall 2022",
];

const allResults = {
  "Fall 2024": [
    { code: "CS102", title: "Intro to Algorithms", credits: 4, grade: "A+", gpa: 4.0, status: "Published" },
    { code: "CS204", title: "Database Management", credits: 3, grade: "A", gpa: 4.0, status: "Published" },
    { code: "MT101", title: "Discrete Mathematics", credits: 3, grade: "—", gpa: null, status: "Evaluating" },
    { code: "CS208", title: "Computer Networks", credits: 3, grade: "—", gpa: null, status: "In Progress" },
  ],
  "Spring 2024": [
    { code: "CS101", title: "Programming Fundamentals", credits: 4, grade: "A+", gpa: 4.0, status: "Published" },
    { code: "CS103", title: "Data Structures", credits: 3, grade: "A", gpa: 4.0, status: "Published" },
    { code: "MT100", title: "Calculus I", credits: 3, grade: "A-", gpa: 3.7, status: "Published" },
    { code: "EN101", title: "Technical English", credits: 2, grade: "B+", gpa: 3.3, status: "Published" },
  ],
  "Fall 2023": [
    { code: "CS100", title: "Intro to Computing", credits: 3, grade: "A", gpa: 4.0, status: "Published" },
    { code: "MT099", title: "Pre-Calculus", credits: 3, grade: "A-", gpa: 3.7, status: "Published" },
    { code: "PH101", title: "Physics I", credits: 3, grade: "B+", gpa: 3.3, status: "Published" },
    { code: "EN100", title: "English Composition", credits: 2, grade: "A", gpa: 4.0, status: "Published" },
  ],
};

const gradeColors = {
  "A+": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "A": "bg-emerald-50 text-emerald-600 border-emerald-200",
  "A-": "bg-blue-50 text-blue-600 border-blue-200",
  "B+": "bg-sky-50 text-sky-600 border-sky-200",
  "B": "bg-indigo-50 text-indigo-600 border-indigo-200",
  "B-": "bg-violet-50 text-violet-600 border-violet-200",
  "C+": "bg-amber-50 text-amber-600 border-amber-200",
  "—": "bg-slate-50 text-slate-400 border-slate-200",
};

const statusStyles = {
  Published: "bg-[#3856c4]/10 text-[#3856c4] border border-[#3856c4]/20",
  Evaluating: "bg-amber-50 text-amber-600 border border-amber-200",
  "In Progress": "bg-slate-50 text-slate-500 border border-slate-200",
};

export default function ResultsPage() {
  const [selectedSemester, setSelectedSemester] = useState("Fall 2024");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const results = allResults[selectedSemester] || [];
  const filteredResults = results.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedResults = results.filter((r) => r.grade !== "—");
  const semesterGPA =
    publishedResults.length > 0
      ? (
          publishedResults.reduce((sum, r) => sum + (r.gpa || 0) * r.credits, 0) /
          publishedResults.reduce((sum, r) => sum + r.credits, 0)
        ).toFixed(2)
      : "—";
  const totalCredits = results.reduce((sum, r) => sum + r.credits, 0);
  const earnedCredits = publishedResults.reduce((sum, r) => sum + r.credits, 0);

  // Grade distribution
  const gradeCounts = {};
  publishedResults.forEach((r) => {
    gradeCounts[r.grade] = (gradeCounts[r.grade] || 0) + 1;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">
            Results
          </h1>
          <p className="text-slate-500 text-[15px] mt-1">
            View your academic results across all semesters.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Export Results
        </button>
      </div>

      {/* Semester Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#3856c4] to-[#2d47a8] text-white rounded-2xl p-5">
          <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">
            Semester GPA
          </p>
          <h2 className="text-3xl font-extrabold">{semesterGPA}</h2>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Total Subjects
          </p>
          <h2 className="text-3xl font-extrabold text-slate-800">
            {results.length}
          </h2>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Credits Earned
          </p>
          <h2 className="text-3xl font-extrabold text-slate-800">
            {earnedCredits}{" "}
            <span className="text-lg text-slate-400 font-medium">
              / {totalCredits}
            </span>
          </h2>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Published
          </p>
          <h2 className="text-3xl font-extrabold text-slate-800">
            {publishedResults.length}{" "}
            <span className="text-lg text-slate-400 font-medium">
              / {results.length}
            </span>
          </h2>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Semester Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-sm font-semibold text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Filter className="w-4 h-4 text-slate-400" />
            {selectedSemester}
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-20">
              {semesters.map((sem) => (
                <button
                  key={sem}
                  onClick={() => {
                    setSelectedSemester(sem);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                    sem === selectedSemester
                      ? "bg-[#3856c4]/5 text-[#3856c4] font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {sem}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3856c4]/20 focus:border-[#3856c4]/40 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Code
              </th>
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Subject Title
              </th>
              <th className="text-center px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Credits
              </th>
              <th className="text-center px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Grade
              </th>
              <th className="text-center px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Grade Points
              </th>
              <th className="text-right px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((r, i) => (
              <tr
                key={r.code}
                className={`group hover:bg-slate-50/50 transition-colors ${
                  i < filteredResults.length - 1
                    ? "border-b border-slate-50"
                    : ""
                }`}
              >
                <td className="px-5 py-4">
                  <span className="text-sm font-bold text-[#3856c4]">
                    {r.code}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600 font-medium">
                  {r.title}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600 font-medium text-center">
                  {r.credits}
                </td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      gradeColors[r.grade] || gradeColors["—"]
                    }`}
                  >
                    {r.grade}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-slate-700 text-center">
                  {r.gpa !== null ? r.gpa.toFixed(1) : "—"}
                </td>
                <td className="px-5 py-4 text-right">
                  <span
                    className={`inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md ${
                      statusStyles[r.status]
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grade Distribution */}
      {Object.keys(gradeCounts).length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
            Grade Distribution — {selectedSemester}
          </h3>
          <div className="flex items-end gap-4 h-32">
            {Object.entries(gradeCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([grade, count]) => {
                const maxCount = Math.max(...Object.values(gradeCounts));
                const heightPct = (count / maxCount) * 100;
                return (
                  <div
                    key={grade}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <span className="text-xs font-bold text-slate-600">
                      {count}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-[#3856c4] to-[#6882e0] rounded-t-lg transition-all duration-500"
                      style={{ height: `${heightPct}%`, minHeight: "8px" }}
                    ></div>
                    <span className="text-[11px] font-bold text-slate-500">
                      {grade}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
