import { CheckCircle2, Clock, AlertOctagon } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 opacity-0 animate-fadeInUp">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Comprehensive Analytics</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Get a bird's-eye view of academic performance across cohorts, track grade distributions, and identify concerning trends instantly.</p>
        </div>
        
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] ring-1 ring-slate-900/5 mx-auto w-full max-w-5xl opacity-0 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          {/* Mockup Window header */}
          <div className="bg-slate-50/80 backdrop-blur-md border-b border-slate-200 p-4 rounded-t-2xl flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="mx-auto bg-white/50 border border-slate-200 shadow-sm rounded-md px-24 py-1.5 flex items-center justify-center text-xs font-medium text-slate-400">
              admin.uniinsight.edu
            </div>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
          
          {/* Mockup body */}
          <div className="p-6 md:p-10 flex flex-col md:flex-row gap-10 bg-white rounded-b-2xl">
            {/* Left Sidebar (Leaderboard) */}
            <div className="w-full md:w-1/3 bg-slate-50/50 rounded-xl p-6 border border-slate-100">
              <h4 className="font-bold mb-6 text-sm uppercase text-slate-500 tracking-wider">Top Performers</h4>
              <div className="space-y-4">
                {[
                  { name: "Alice Smith", gpa: "3.98", rank: 1, color: "text-amber-500", bg: "bg-amber-100/50" },
                  { name: "John Doe", gpa: "3.95", rank: 2, color: "text-slate-400", bg: "bg-slate-100" },
                  { name: "Emma Watson", gpa: "3.91", rank: 3, color: "text-amber-700", bg: "bg-orange-100/50" }
                ].map((student, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all cursor-default">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full ${student.bg} flex items-center justify-center text-sm font-bold ${student.color}`}>
                        {student.rank}
                      </div>
                      <div className="text-sm font-semibold text-slate-700">{student.name}</div>
                    </div>
                    <div className="font-bold text-blue-700">{student.gpa}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Content (Charts) */}
            <div className="w-full md:w-2/3 flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-2 uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Total Verified
                  </div>
                  <div className="text-3xl font-extrabold text-slate-800">1,880</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-2 uppercase tracking-wide">
                    <Clock className="w-4 h-4 text-amber-500" /> Pending Approval
                  </div>
                  <div className="text-3xl font-extrabold text-amber-600">42</div>
                </div>
                <div className="bg-rose-50/30 border border-rose-100 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-rose-500 font-medium mb-2 uppercase tracking-wide">
                    <AlertOctagon className="w-4 h-4 text-rose-500" /> System Alerts
                  </div>
                  <div className="text-3xl font-extrabold text-rose-600">7</div>
                </div>
              </div>
              <div className="border border-slate-200 rounded-xl p-6 relative min-h-[220px] flex items-center justify-center bg-slate-50/30">
                <span className="text-slate-800 font-bold absolute top-5 left-6 text-sm">Batch GPA Distribution</span>
                {/* Simulated Chart */}
                <div className="flex items-end gap-3 w-full h-36 mt-10 justify-around px-2">
                  {[20, 35, 60, 85, 45].map((h, i) => (
                    <div key={i} className="w-full max-w-[60px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md relative group cursor-pointer transition-all hover:opacity-90" style={{ height: `${h}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded shadow-md border border-slate-100">
                        {h}%
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-3 w-full flex justify-around px-8 text-xs text-slate-400 font-bold tracking-wider">
                  <span>&lt; 2.0</span>
                  <span>2.0-2.5</span>
                  <span>2.5-3.0</span>
                  <span>3.0-3.5</span>
                  <span>3.5-4.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}