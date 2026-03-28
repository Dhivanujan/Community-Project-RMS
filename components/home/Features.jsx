import { Calculator, Trophy, Medal, AlertTriangle } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "GPA Automation",
      desc: "Instantly calculate semester and cumulative GPAs with precision, eliminating manual spreadsheet errors.",
      color: "blue"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Academic Ranking",
      desc: "Automated batch ranking systems to identify top performers across different computing disciplines.",
      color: "indigo"
    },
    {
      icon: <Medal className="w-6 h-6" />,
      title: "Class Identification",
      desc: "Predict and identify potential First Class and Second Class Upper graduates early in their degree.",
      color: "emerald"
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Early Warning System",
      desc: "Flag students at risk of academic probation, enabling timely and targeted faculty intervention.",
      color: "rose"
    }
  ];

  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 opacity-0 animate-fadeInUp">
          <div className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">Capabilities</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Core Academic Features</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Designed specifically for computing departments to streamline grading pipelines and identify student potential.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((opt, i) => (
            <div key={i} className="bg-slate-50 hover:bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group cursor-pointer opacity-0 animate-fadeInUp" style={{ animationDelay: `${(i+1) * 150}ms` }}>
              <div className={`w-14 h-14 bg-white text-${opt.color}-600 rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 transition-transform duration-300 group-hover:scale-110 group-hover:bg-${opt.color}-600 group-hover:text-white`}>
                {opt.icon}
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-3 transition-colors">{opt.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{opt.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}