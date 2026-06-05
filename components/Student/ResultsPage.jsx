"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, ChevronDown, FileText, Loader2 } from "lucide-react";

const gradeColors = {
  "A+": "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/50",
  "A": "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/50",
  "A-": "bg-primary-50 dark:bg-blue-950/30 text-primary-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/50",
  "B+": "bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-200/60 dark:border-sky-800/50",
  "B": "bg-indigo-50 dark:bg-indigo-950/30 text-primary-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/50",
  "B-": "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border-violet-200/60 dark:border-violet-800/50",
  "C+": "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/50",
  "—": "bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-slate-200/60 dark:border-slate-700/60",
};

const statusConfig = {
  Published: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500 dark:bg-emerald-400",
    border: "border-emerald-200/60 dark:border-emerald-850/60",
  },
  Evaluating: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-secondary-500 dark:bg-amber-500",
    border: "border-amber-200/60 dark:border-amber-850/60",
  },
  "In Progress": {
    bg: "bg-slate-50 dark:bg-slate-850/30",
    text: "text-slate-600 dark:text-slate-400",
    dot: "bg-slate-400 dark:bg-slate-550",
    border: "border-slate-200/60 dark:border-slate-700/60",
  },
};

export default function ResultsPage() {
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const url = new URL('/api/student/results', window.location.origin);
        if (selectedSemester) {
          url.searchParams.append('semester', selectedSemester);
        }
        if (searchQuery) {
          url.searchParams.append('search', searchQuery);
        }

        const response = await fetch(url.toString(), {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setData(result.data);
            if (!selectedSemester && result.data.selectedSemester) {
              setSelectedSemester(result.data.selectedSemester);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch results", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedSemester, searchQuery]);

  const semesters = data?.semesters || [];
  const results = data?.results || [];
  const stats = data?.stats || {
    semesterGpa: "—",
    totalSubjects: 0,
    totalCredits: 0,
    earnedCredits: 0,
    publishedCount: 0
  };
  const gradeCounts = data?.gradeDistribution || {};

  const semesterGPA = stats.semesterGpa !== null ? stats.semesterGpa : "—";
  const totalCredits = stats.totalCredits;
  const earnedCredits = stats.earnedCredits;
  const publishedCount = stats.publishedCount;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Results
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            View your academic results across all semesters.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-primary-900 dark:bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#163050] dark:hover:bg-blue-700 transition-colors shadow-sm shadow-[primary-900]/15 dark:shadow-blue-500/10">
          <Download className="w-3.5 h-3.5" />
          Export Transcript
        </button>
      </div>

      {/* Semester Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-900 via-[#1b395e] to-[#12263f] text-white rounded-xl p-5 shadow-sm shadow-[primary-900]/10">
          <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.12em] mb-1">
            Semester GPA
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight">{semesterGPA}</h2>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.12em] mb-1">
            Total Subjects
          </p>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">
            {results.length}
          </h2>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.12em] mb-1">
            Credits Earned
          </p>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">
            {earnedCredits}{" "}
            <span className="text-lg text-slate-400 dark:text-slate-500 font-medium">
              / {totalCredits}
            </span>
          </h2>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-[0.12em] mb-1">
            Published
          </p>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-200 tracking-tight">
            {publishedCount}{" "}
            <span className="text-lg text-slate-400 dark:text-slate-500 font-medium">
              / {stats.totalSubjects}
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
            className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 px-3.5 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            {selectedSemester || "Select Semester"}
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg shadow-lg dark:shadow-slate-950/40 py-1.5 z-20">
              {semesters.map((sem) => (
                <button
                  key={sem}
                  onClick={() => {
                    setSelectedSemester(sem);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-[13px] font-medium transition-colors ${
                    sem === selectedSemester
                      ? "bg-primary-900/[0.05] dark:bg-blue-900/20 text-primary-900 dark:text-blue-400 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-900/15 dark:focus:ring-blue-500/15 focus:border-primary-900/30 dark:focus:border-blue-500/30 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-200">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-100 dark:border-slate-800">
              <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">
                Code
              </th>
              <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">
                Subject Title
              </th>
              <th className="text-center px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">
                Credits
              </th>
              <th className="text-center px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">
                Grade
              </th>
              <th className="text-center px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">
                Grade Points
              </th>
              <th className="text-right px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-5 py-12 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-900 dark:text-blue-500" />
                    <span className="text-sm font-medium">Loading results...</span>
                  </div>
                </td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-5 py-12 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500">No results found for this semester.</span>
                  </div>
                </td>
              </tr>
            ) : (
              results.map((r, i) => {
                const status = statusConfig[r.status] || statusConfig["In Progress"];
              return (
                <tr
                  key={r.code}
                  className={`group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                    i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/30 dark:bg-slate-900/40"
                  } ${i < results.length - 1 ? "border-b border-slate-100/60 dark:border-slate-800" : ""}`}
                >
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] font-bold text-primary-900 dark:text-blue-400">
                      {r.code}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-slate-600 dark:text-slate-300 font-medium">
                    {r.title}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-slate-600 dark:text-slate-300 font-medium text-center">
                    {r.credits}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span
                      className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-md border ${
                        gradeColors[r.grade] || gradeColors["—"]
                      }`}
                    >
                      {r.grade}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] font-semibold text-slate-700 dark:text-slate-300 text-center">
                    {r.gpa !== null ? r.gpa.toFixed(1) : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${status.bg} ${status.text} border ${status.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {r.status}
                    </span>
                  </td>
                </tr>
              );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Grade Distribution */}
      {Object.keys(gradeCounts).length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm transition-colors duration-200">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-[0.1em] mb-5">
            Grade Distribution — {selectedSemester}
          </h3>
          <div className="flex items-end gap-5 h-32">
            {Object.entries(gradeCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([grade, count]) => {
                const maxCount = Math.max(...Object.values(gradeCounts));
                const heightPct = (count / maxCount) * 100;
                return (
                  <div
                    key={grade}
                    className="flex-1 flex flex-col items-center gap-2 group"
                  >
                    <span className="text-xs font-bold text-primary-900 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {count}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-primary-900 dark:from-blue-600 to-[#3d6a99] dark:to-blue-400 rounded-t-lg transition-all duration-500 cursor-pointer hover:from-[#163050] dark:hover:from-blue-700 hover:to-primary-600 dark:hover:to-blue-500"
                      style={{ height: `${heightPct}%`, minHeight: "8px" }}
                    />
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-450">
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
