"use client";

const subjects = [
  {
    code: "CS102",
    title: "Intro to Algorithms",
    grade: "A+",
    status: "Published",
  },
  {
    code: "CS204",
    title: "Database Management",
    grade: "A",
    status: "Published",
  },
  {
    code: "MT101",
    title: "Discrete Mathematics",
    grade: "—",
    status: "Evaluating",
  },
  {
    code: "CS208",
    title: "Computer Networks",
    grade: "—",
    status: "In Progress",
  },
];

const statusStyles = {
  Published:
    "bg-[#3856c4]/10 text-[#3856c4] border border-[#3856c4]/20",
  Evaluating:
    "bg-amber-50 text-amber-600 border border-amber-200",
  "In Progress":
    "bg-slate-50 text-slate-500 border border-slate-200",
};

export default function SemesterTable() {
  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold text-slate-800">Current Semester</h3>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          Fall 2024
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Subject Code
              </th>
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Title
              </th>
              <th className="text-left px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Grade
              </th>
              <th className="text-right px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, i) => (
              <tr
                key={subject.code}
                className={`group hover:bg-slate-50/50 transition-colors ${
                  i < subjects.length - 1 ? "border-b border-slate-50" : ""
                }`}
              >
                <td className="px-5 py-4">
                  <a
                    href={`/student/results/${subject.code.toLowerCase()}`}
                    className="text-sm font-bold text-[#3856c4] hover:underline"
                  >
                    {subject.code}
                  </a>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600 font-medium">
                  {subject.title}
                </td>
                <td className="px-5 py-4 text-sm font-bold text-slate-800">
                  {subject.grade}
                </td>
                <td className="px-5 py-4 text-right">
                  <span
                    className={`inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md ${
                      statusStyles[subject.status]
                    }`}
                  >
                    {subject.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
