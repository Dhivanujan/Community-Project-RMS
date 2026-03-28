import { Trophy, TrendingUp, AlertTriangle } from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Academic Performance Overview
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Visualize GPA trends, identify top performers, and monitor academic
            progress across all departments in one unified dashboard.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 md:p-10 animate-fadeInUp">
          
          <div className="flex flex-col md:flex-row gap-10">
            
            {/* 🏆 Left: Top Students */}
            <div className="w-full md:w-1/3 bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h4 className="font-bold mb-6 text-sm uppercase text-slate-500 tracking-wider">
                Batch Top Performers
              </h4>

              <div className="space-y-4">
                {[
                  { name: "Student A", gpa: "3.92", rank: 1 },
                  { name: "Student B", gpa: "3.88", rank: 2 },
                  { name: "Student C", gpa: "3.84", rank: 3 },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-100 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {s.rank}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {s.name}
                      </span>
                    </div>
                    <span className="font-bold text-blue-700">{s.gpa}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 📊 Right Section */}
            <div className="w-full md:w-2/3 flex flex-col gap-6">
              
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 uppercase">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Avg GPA
                  </div>
                  <div className="text-3xl font-extrabold text-slate-800">
                    3.42
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 uppercase">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    First Class Eligible
                  </div>
                  <div className="text-3xl font-extrabold text-amber-600">
                    128
                  </div>
                </div>

                <div className="bg-rose-50 border border-rose-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-xs text-rose-500 mb-2 uppercase">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    At Risk
                  </div>
                  <div className="text-3xl font-extrabold text-rose-600">
                    34
                  </div>
                </div>
              </div>

              {/* GPA Chart */}
              <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
                <h5 className="text-sm font-semibold text-slate-700 mb-4">
                  Batch GPA Distribution
                </h5>

                <div className="flex items-end gap-3 h-40">
                  {[25, 40, 70, 90, 60].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-blue-500 rounded-t-md hover:opacity-80 transition"
                      style={{ height: `${h}%` }}
                    ></div>
                  ))}
                </div>

                <div className="flex justify-between text-xs text-slate-400 mt-3">
                  <span>&lt;2.0</span>
                  <span>2.0</span>
                  <span>2.5</span>
                  <span>3.0</span>
                  <span>3.5+</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}