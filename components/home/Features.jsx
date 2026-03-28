import { Calculator, Trophy, Medal, AlertTriangle } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "GPA Automation",
      desc: "Instantly calculate semester and cumulative GPAs with precision, eliminating manual spreadsheet errors.",
      color: "blue",
      bg: "bg-blue-100",
      text: "text-blue-600",
      hover: "group-hover:bg-blue-600 group-hover:text-white",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Academic Ranking",
      desc: "Automated batch ranking systems to identify top performers across different computing disciplines.",
      color: "indigo",
      bg: "bg-indigo-100",
      text: "text-indigo-600",
      hover: "group-hover:bg-indigo-600 group-hover:text-white",
    },
    {
      icon: <Medal className="w-6 h-6" />,
      title: "Class Identification",
      desc: "Identify First Class, Second Upper, and other graduation categories automatically.",
      color: "emerald",
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      hover: "group-hover:bg-emerald-600 group-hover:text-white",
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Early Warning System",
      desc: "Detect students at academic risk and notify lecturers for timely intervention.",
      color: "rose",
      bg: "bg-rose-100",
      text: "text-rose-600",
      hover: "group-hover:bg-rose-600 group-hover:text-white",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <div className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">
            Capabilities
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Core Academic Features
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Designed for the Faculty of Computing to streamline result management,
            automate GPA calculations, and identify student performance insights.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((opt, i) => (
            <div
              key={i}
              className="bg-slate-50 hover:bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group cursor-pointer animate-fadeInUp"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 ${opt.bg} ${opt.text} rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 transition-all duration-300 group-hover:scale-110 ${opt.hover}`}
              >
                {opt.icon}
              </div>

              {/* Title */}
              <h3 className="font-bold text-xl text-slate-900 mb-3">
                {opt.title}
              </h3>

              {/* Description */}
              <p className="text-slate-500 text-sm leading-relaxed">
                {opt.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}