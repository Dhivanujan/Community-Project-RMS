"use client";


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

const gradeColors = {
  "A+": "text-emerald-600 bg-emerald-50",
  "A": "text-emerald-600 bg-emerald-50",
  "A-": "text-blue-600 bg-blue-50",
  "B+": "text-sky-600 bg-sky-50",
  "—": "text-slate-400 bg-slate-50",
};

export default function SemesterTable({ currentSemester }) {
  const subjects = currentSemester?.subjects || [];
  const semesterName = currentSemester?.name || "No Semester Data";

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Current Semester
        </h3>
        <span className="text-[11px] font-semibold text-[#1e3a5f] bg-[#1e3a5f]/[0.06] px-2.5 py-1 rounded-md border border-[#1e3a5f]/10">
          {semesterName}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                Code
              </th>
              <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                Title
              </th>
              <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                Grade
              </th>
              <th className="text-right px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-sm text-slate-500 font-medium">
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
                    className={`group hover:bg-slate-50/60 transition-colors ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                    } ${i < subjects.length - 1 ? "border-b border-slate-100/60" : ""}`}
                  >
                    <td className="px-4 py-3.5">
                      <a
                        href={`/student/results/${subject.code.toLowerCase()}`}
                        className="text-[13px] font-bold text-[#1e3a5f] hover:text-[#2d5a8e] hover:underline transition-colors"
                      >
                        {subject.code}
                      </a>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-slate-600 font-medium">
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
