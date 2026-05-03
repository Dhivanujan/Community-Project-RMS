"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, ChevronDown, FileText, Loader2 } from "lucide-react";

const gradeColors = {
  "A+": "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  "A": "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  "A-": "bg-blue-50 text-blue-600 border-blue-200/60",
  "B+": "bg-sky-50 text-sky-600 border-sky-200/60",
  "B": "bg-indigo-50 text-indigo-600 border-indigo-200/60",
  "B-": "bg-violet-50 text-violet-600 border-violet-200/60",
  "C+": "bg-amber-50 text-amber-600 border-amber-200/60",
  "—": "bg-slate-50 text-slate-400 border-slate-200/60",
};

const statusConfig = {
  Published: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200/60",
  },
  Evaluating: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    border: "border-amber-200/60",
  },
  "In Progress": {
    bg: "bg-slate-50",
    text: "text-slate-600",
    dot: "bg-slate-400",
    border: "border-slate-200/60",
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

    // Use a small debounce for search query to avoid too many requests
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Results
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            View your academic results across all semesters.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#163050] transition-colors shadow-sm shadow-[#1e3a5f]/15">
          <Download className="w-3.5 h-3.5" />
          Export Transcript
        </button>
      </div>

      {/* Semester Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#1e3a5f] to-[#163050] text-white rounded-xl p-5 shadow-sm shadow-[#1e3a5f]/10">
          <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.12em] mb-1">
            Semester GPA
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight">{semesterGPA}</h2>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.12em] mb-1">
            Total Subjects
          </p>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {results.length}
          </h2>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.12em] mb-1">
            Credits Earned
          </p>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {earnedCredits}{" "}
            <span className="text-lg text-slate-400 font-medium">
              / {totalCredits}
            </span>
          </h2>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.12em] mb-1">
            Published
          </p>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {publishedCount}{" "}
            <span className="text-lg text-slate-400 font-medium">
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
            className="inline-flex items-center gap-2 bg-white border border-slate-200/80 text-sm font-semibold text-slate-700 px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            {selectedSemester || "Select Semester"}
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 mt-1.5 w-48 bg-white border border-slate-200/80 rounded-lg shadow-lg shadow-slate-200/50 py-1.5 z-20">
              {semesters.map((sem) => (
                <button
                  key={sem}
                  onClick={() => {
                    setSelectedSemester(sem);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-[13px] font-medium transition-colors ${
                    sem === selectedSemester
                      ? "bg-[#1e3a5f]/[0.05] text-[#1e3a5f] font-semibold"
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/80 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/15 focus:border-[#1e3a5f]/30 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                Code
              </th>
              <th className="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                Subject Title
              </th>
              <th className="text-center px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                Credits
              </th>
              <th className="text-center px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                Grade
              </th>
              <th className="text-center px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                Grade Points
              </th>
              <th className="text-right px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-5 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-[#1e3a5f]" />
                    <span className="text-sm font-medium">Loading results...</span>
                  </div>
                </td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-5 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="w-8 h-8 text-slate-300" />
                    <span className="text-sm font-medium text-slate-400">No results found for this semester.</span>
                  </div>
                </td>
              </tr>
            ) : (
              results.map((r, i) => {
                const status = statusConfig[r.status] || statusConfig["In Progress"];
              return (
                <tr
                  key={r.code}
                  className={`group hover:bg-slate-50/60 transition-colors ${
                    i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                  } ${i < results.length - 1 ? "border-b border-slate-100/60" : ""}`}
                >
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] font-bold text-[#1e3a5f]">
                      {r.code}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-slate-600 font-medium">
                    {r.title}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-slate-600 font-medium text-center">
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
                  <td className="px-5 py-3.5 text-[13px] font-semibold text-slate-700 text-center">
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
        <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-[0.1em] mb-5">
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
                    <span className="text-xs font-bold text-[#1e3a5f] opacity-0 group-hover:opacity-100 transition-opacity">
                      {count}
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-[#1e3a5f] to-[#3d6a99] rounded-t-lg transition-all duration-500 cursor-pointer hover:from-[#163050] hover:to-[#2d5a8e]"
                      style={{ height: `${heightPct}%`, minHeight: "8px" }}
                    />
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
