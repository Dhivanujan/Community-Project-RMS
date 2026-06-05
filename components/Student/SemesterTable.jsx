"use client";

const statusConfig = {
  Published: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500 dark:bg-emerald-400",
    border: "border-emerald-200/60 dark:border-emerald-800/60",
  },
  Evaluating: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-secondary-500 dark:bg-amber-500",
    border: "border-amber-200/60 dark:border-amber-800/60",
  },
  "In Progress": {
    bg: "bg-slate-50 dark:bg-slate-800/30",
    text: "text-slate-600 dark:text-slate-400",
    dot: "bg-slate-400 dark:bg-slate-500",
    border: "border-slate-200/60 dark:border-slate-700/60",
  },
};

const gradeColors = {
  "A+": "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30",
  "A": "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30",
  "A-": "text-primary-600 bg-primary-50 dark:text-blue-400 dark:bg-blue-950/30",
  "B+": "text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-950/30",
  "—": "text-slate-400 bg-slate-50 dark:text-slate-500 dark:bg-slate-850/50",
};

export default function SemesterTable({ currentSemester }) {
  const subjects = currentSemester?.subjects || [];
  const semesterName = currentSemester?.name || "No Semester Data";

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Current Semester
        </h3>
        <span className="text-[11px] font-semibold text-primary-900 dark:text-[#d4a843] bg-primary-900/[0.06] dark:bg-[#d4a843]/10 px-2.5 py-1 rounded-md border border-primary-900/10 dark:border-[#d4a843]/20 transition-colors">
          {semesterName}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm transition-colors duration-200">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-100 dark:border-slate-800">
              <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">
                Code
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">
                Title
              </th>
              <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">
                Grade
              </th>
              <th className="text-right px-4 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                  No subjects found for this semester.
                </td>
              </tr>
            ) : (
              subjects.map((subject, i) => {
                const status = statusConfig[subject.status] || statusConfig["In Progress"];
                const grade = gradeColors[subject.grade] || gradeColors["—"];
                return (
                  <tr
                    key={subject.code}
                    className={`group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors ${
                      i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/30 dark:bg-slate-900/40"
                    } ${i < subjects.length - 1 ? "border-b border-slate-100/60 dark:border-slate-800" : ""}`}
                  >
                    <td className="px-4 py-3.5">
                      <a
                        href={`/student/results/${subject.code.toLowerCase()}`}
                        className="text-[13px] font-bold text-primary-900 dark:text-blue-400 hover:text-primary-600 dark:hover:text-blue-300 hover:underline transition-colors"
                      >
                        {subject.code}
                      </a>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-slate-600 dark:text-slate-300 font-medium">
                      {subject.title}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-block text-xs font-bold px-2 py-0.5 rounded-md ${grade}`}
                      >
                        {subject.grade || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${status.bg} ${status.text} border ${status.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {subject.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
