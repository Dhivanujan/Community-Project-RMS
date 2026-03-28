import Link from 'next/link';
import { ArrowRight, GraduationCap, BarChart3, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden pt-24 pb-32">
      {/* Decorative background grid and blurs */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[600px] bg-blue-100/50 rounded-full blur-3xl opacity-50 z-0"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-3xl opacity-50 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Side Content */}
          <div className="flex-1 text-center lg:text-left opacity-0 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-sm font-medium mb-6 border border-blue-200">
              <GraduationCap className="w-4 h-4" />
              <span>Official Results Management System</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Empowering Academic <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
                Excellence
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              A secure, intuitive, and comprehensive platform for the Faculty of Computing to manage student performance, generate analytics, and ensure academic integrity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="#login" className="group flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-8 py-3.5 rounded-lg font-semibold transition-all transform hover:-translate-y-0.5 hover:shadow-lg shadow-blue-500/30">
                Faculty Login
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#features" className="flex items-center justify-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-8 py-3.5 rounded-lg font-semibold transition-all transform hover:-translate-y-0.5 hover:shadow-md">
                Student Portal
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>UGC Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>Real-time Analytics</span>
              </div>
            </div>
          </div>

          {/* Right Side Mockup */}
          <div className="flex-1 w-full max-w-xl lg:max-w-2xl opacity-0 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl shadow-2xl p-2 relative z-10 ring-1 ring-slate-900/5">
              <div className="bg-white rounded-xl overflow-hidden border border-slate-100">
                {/* Mockup Header */}
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  </div>
                  <div className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
                    dashboard.uniinsight.edu
                  </div>
                </div>
                
                {/* Mockup Content */}
                <div className="p-6">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Batch 2021 Overview</h3>
                      <p className="text-sm text-slate-500">BSc (Hons) Computer Science</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">3.42</div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg GPA</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "First Class", val: "45", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                      { label: "Second Upper", val: "82", color: "bg-blue-50 text-blue-700 border-blue-100" },
                      { label: "Second Lower", val: "40", color: "bg-indigo-50 text-indigo-700 border-indigo-100" }
                    ].map((stat, i) => (
                      <div key={i} className={`p-4 rounded-xl border ${stat.color}`}>
                        <div className="text-2xl font-bold mb-1">{stat.val}</div>
                        <div className="text-xs font-semibold uppercase">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chart Mockup */}
                  <div className="relative h-40 bg-slate-50 rounded-xl border border-slate-100 p-4 flex items-end justify-between gap-2 overflow-hidden">
                    <div className="absolute top-4 left-4 text-xs font-semibold text-slate-400">GPA Distribution</div>
                    {[40, 70, 45, 90, 60, 85, 50].map((h, i) => (
                      <div key={i} className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md opacity-80 hover:opacity-100 transition-opacity cursor-pointer delay-100 animate-fadeInUp" style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating decoration */}
            <div className="absolute -right-8 top-12 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-float z-20 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Results Published</div>
                  <div className="text-xs text-slate-500">Just now</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}