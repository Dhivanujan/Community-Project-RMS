import Link from 'next/link';
import { ArrowRight, Activity, TrendingUp, Trophy, Users, BookOpen } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative bg-white overflow-hidden pt-20 pb-32">
      {/* Minimal clean background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-50"></div>
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-60 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Side Content */}
          <div className="flex-1 text-center lg:text-left opacity-0 animate-fadeInUp" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
              Smart Results <br className="hidden lg:block"/> Management for <span className="text-blue-600">SUSL</span>
            </h1>
            
            <p className="text-xl text-slate-700 font-medium mb-4 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Automate GPA calculations, track academic performance, and identify top achievers with an intelligent results management system.
            </p>

            <p className="text-base text-slate-500 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Designed for the Faculty of Computing to support Software Engineering, Computing & Information Systems, and Data Science departments.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="#login" className="group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-lg font-semibold transition-all transform hover:-translate-y-0.5 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30">
                Login
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 px-8 py-3.5 rounded-lg font-semibold transition-all transform hover:-translate-y-0.5 hover:shadow-sm">
                Explore Features
              </Link>
            </div>
          </div>

          {/* Right Side Visual */}
          <div className="flex-1 w-full max-w-xl lg:max-w-2xl opacity-0 animate-fadeIn" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-2 relative z-10 border border-slate-100">
              <div className="bg-slate-50/50 rounded-xl overflow-hidden border border-slate-100">
                {/* Mockup Header */}
                <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  </div>
                  <div className="bg-slate-50 px-4 py-1.5 rounded-md flex-1 text-center text-[11px] font-semibold text-slate-500 border border-slate-100 truncate">
                    SUSL MeritMatrix.susl.lk/dashboard
                  </div>
                </div>
                
                {/* Mockup Content */}
                <div className="p-5 flex flex-col gap-5">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Overall GPA', val: '3.42', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
                      { label: 'Total Students', val: '850', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                      { label: 'Active Courses', val: '42', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                    ].map((stat, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm flex flex-col gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg}`}>
                          <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-slate-800">{stat.val}</div>
                          <div className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wide">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    {/* Line Chart Section */}
                    <div className="sm:col-span-7 bg-white rounded-xl border border-slate-100 p-4 shrink-0 shadow-sm flex flex-col">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Performance Trend</span>
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                      </div>
                      {/* Simple CSS-based Line Chart */}
                      <div className="relative h-28 w-full mt-auto mb-2 flex items-end justify-between px-2">
                        {/* Connecting Line (Simulated with SVG) */}
                        <svg className="absolute inset-0 w-full h-full text-blue-200 stroke-current opacity-60" preserveAspectRatio="none">
                          <path d="M 10,80 L 50,60 L 90,70 L 130,40 L 170,50 L 210,20 L 250,30" fill="none" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        
                        {/* Data Points */}
                        {[20, 40, 30, 60, 50, 80, 70].map((h, i) => (
                          <div key={i} className="relative z-10 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-100 shadow-sm transition-transform hover:scale-150" style={{ transform: `translateY(-${h}px)` }}></div>
                        ))}
                      </div>
                      {/* X-axis labels */}
                      <div className="flex justify-between w-full px-1 text-[9px] font-bold text-slate-400 mt-2">
                        <span>Y1S1</span><span>Y1S2</span><span>Y2S1</span><span>Y2S2</span><span>Y3S1</span><span>Y3S2</span><span>Y4S1</span>
                      </div>
                    </div>

                    {/* Leaderboard Section */}
                    <div className="sm:col-span-5 bg-white rounded-xl border border-slate-100 p-4 shadow-sm flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Top Rankers</span>
                        <Trophy className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="space-y-4 flex-1 justify-center flex flex-col">
                        {[
                          { rank: 1, name: 'John Doe', gpa: '3.98', badge: 'bg-amber-100 text-amber-700' },
                          { rank: 2, name: 'Alice Smith', gpa: '3.95', badge: 'bg-slate-100 text-slate-600' },
                          { rank: 3, name: 'Emma Watson', gpa: '3.91', badge: 'bg-orange-100 text-orange-700' }
                        ].map((student, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${student.badge}`}>
                                {student.rank}
                              </div>
                              <span className="text-xs font-semibold text-slate-700">{student.name}</span>
                            </div>
                            <span className="text-xs font-bold text-blue-600">{student.gpa}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
