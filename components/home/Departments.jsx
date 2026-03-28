import { Code2, Network, Database } from "lucide-react";

export default function Departments() {
  const departments = [
    {
      title: "Software Engineering",
      icon: <Code2 className="w-5 h-5" />,
      students: 850,
      gpa: 3.45,
      bg: "bg-blue-100",
      text: "text-blue-600",
      hover: "group-hover:bg-blue-600 group-hover:text-white",
    },
    {
      title: "Computing & Info Systems",
      icon: <Network className="w-5 h-5" />,
      students: 620,
      gpa: 3.38,
      bg: "bg-indigo-100",
      text: "text-indigo-600",
      hover: "group-hover:bg-indigo-600 group-hover:text-white",
    },
    {
      title: "Data Science",
      icon: <Database className="w-5 h-5" />,
      students: 410,
      gpa: 3.52,
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      hover: "group-hover:bg-emerald-600 group-hover:text-white",
    },
  ];

  return (
    <section
      id="departments"
      className="py-24 bg-slate-50 border-y border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Faculty of Computing
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Supporting Software Engineering, Computing & Information Systems,
            and Data Science with advanced academic analytics and result management.
          </p>
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {departments.map((dept, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 group cursor-pointer animate-fadeInUp"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Top Section */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-12 h-12 ${dept.bg} ${dept.text} rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${dept.hover}`}
                >
                  {dept.icon}
                </div>

                <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-700 transition-colors">
                  {dept.title}
                </h3>
              </div>

              {/* Stats Section */}
              <div className="border-t border-slate-100 pt-4 flex justify-between text-sm">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
                    Students
                  </span>
                  <span className="font-bold text-slate-700">
                    {dept.students}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
                    Avg GPA
                  </span>
                  <span className={`font-bold ${dept.text}`}>
                    {dept.gpa}
                  </span>
                </div>
              </div>

              {/* Bottom Tag (NEW – improves UI) */}
              <div className="mt-6">
                <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-500">
                  Active Department
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}