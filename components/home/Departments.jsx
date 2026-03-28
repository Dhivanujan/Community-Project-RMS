import { Code2, Network, Database } from 'lucide-react';

export default function Departments() {
  const departments = [
    { title: "Software Engineering", icon: <Code2 className="w-5 h-5" />, students: 850, gpa: 3.45, color: "blue" },
    { title: "Computing & Info Systems", icon: <Network className="w-5 h-5" />, students: 620, gpa: 3.38, color: "indigo" },
    { title: "Data Science", icon: <Database className="w-5 h-5" />, students: 410, gpa: 3.52, color: "emerald" },
  ];

  return (
    <section id="departments" className="py-24 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 opacity-0 animate-fadeInUp">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Faculty of Computing</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Supporting diverse computing disciplines with tailored evaluation and customized analytics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {departments.map((dept, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 group cursor-pointer opacity-0 animate-fadeInUp" style={{ animationDelay: `${(i+1) * 150}ms` }}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 bg-${dept.color}-50 rounded-xl flex items-center justify-center text-${dept.color}-600 transition-transform duration-300 group-hover:scale-110 group-hover:bg-${dept.color}-600 group-hover:text-white`}>
                  {dept.icon}
                </div>
                <h3 className="font-bold text-lg text-slate-800 transition-colors group-hover:text-blue-700">{dept.title}</h3>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between text-sm">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Students</span>
                  <span className="font-bold text-slate-700">{dept.students}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Avg GPA</span>
                  <span className={`font-bold text-${dept.color}-600`}>{dept.gpa}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}