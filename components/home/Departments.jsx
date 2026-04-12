"use client";

import { Code2, Network, Database } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

export default function Departments({ departmentStats }) {
  const fallbackDepartments = [
    {
      title: "Software Engineering",
      students: 850,
      gpa: 3.45,
      gpaPercent: 86,
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
      gradient: "from-blue-500 to-blue-600",
      barBg: "bg-blue-100",
    },
    {
      title: "Computing & Info Systems",
      icon: <Network className="w-5 h-5" />,
      students: 620,
      gpa: 3.38,
      gpaPercent: 84,
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-100",
      gradient: "from-indigo-500 to-indigo-600",
      barBg: "bg-indigo-100",
    },
    {
      title: "Data Science",
      icon: <Database className="w-5 h-5" />,
      students: 410,
      gpa: 3.52,
      gpaPercent: 88,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
      gradient: "from-emerald-500 to-emerald-600",
      barBg: "bg-emerald-100",
    },
  ];

  const palette = [
    {
      icon: <Code2 className="w-5 h-5" />,
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
      gradient: "from-blue-500 to-blue-600",
      barBg: "bg-blue-100",
    },
    {
      icon: <Network className="w-5 h-5" />,
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      border: "border-indigo-100",
      gradient: "from-indigo-500 to-indigo-600",
      barBg: "bg-indigo-100",
    },
    {
      icon: <Database className="w-5 h-5" />,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-100",
      gradient: "from-emerald-500 to-emerald-600",
      barBg: "bg-emerald-100",
    },
  ];

  const source = departmentStats?.length ? departmentStats : fallbackDepartments;
  const departments = source.map((dept, index) => ({
    ...dept,
    ...palette[index % palette.length],
  }));

  return (
    <section
      id="departments"
      className="py-24 bg-gradient-to-b from-slate-50 to-white border-y border-slate-100 relative overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-30 translate-y-1/3 -translate-x-1/4"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <AnimateOnScroll variant="fadeUp" className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            Academic Departments
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Faculty of Computing
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Supporting Software Engineering, Computing & Information Systems,
            and Data Science with advanced academic analytics and result
            management.
          </p>
        </AnimateOnScroll>

        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {departments.map((dept, i) => (
            <AnimateOnScroll key={i} variant="fadeUp" delay={i * 150}>
              <div
                className={`bg-white rounded-2xl p-6 lg:p-8 border ${dept.border} shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group cursor-pointer relative overflow-hidden`}
              >
                {/* Hover glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${dept.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}
                ></div>

                {/* Top Section */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div
                    className={`w-12 h-12 ${dept.bg} ${dept.text} rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md`}
                  >
                    {dept.icon}
                  </div>

                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-slate-900 transition-colors">
                    {dept.title}
                  </h3>
                </div>

                {/* Stats Section */}
                <div className="border-t border-slate-100 pt-5 space-y-4 relative z-10">
                  <div className="flex justify-between text-sm">
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
                        Students
                      </span>
                      <span className="font-bold text-slate-700 text-lg">
                        {dept.students.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
                        Avg GPA
                      </span>
                      <span className={`font-bold ${dept.text} text-lg`}>
                        {Number(dept.gpa || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* GPA Progress Bar */}
                  <div>
                    <div className={`w-full h-2 ${dept.barBg} rounded-full overflow-hidden`}>
                      <div
                        className={`h-full bg-gradient-to-r ${dept.gradient} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${dept.gpaPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[10px] text-slate-300 font-medium">0.0</span>
                      <span className="text-[10px] text-slate-300 font-medium">4.0</span>
                    </div>
                  </div>
                </div>

                {/* Status Tag */}
                <div className="mt-5 relative z-10">
                  <span className={`text-xs px-3 py-1 rounded-full ${dept.bg} ${dept.text} font-semibold`}>
                    Active Department
                  </span>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}