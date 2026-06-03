import Link from "next/link";
import Image from "next/image";
import suslLogo from "./logo susl.png";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative bg-slate-950 overflow-hidden flex items-center justify-center min-h-[calc(100vh-3.5rem)] py-8 sm:py-12 lg:py-16"
    >
      {/* ── Background Grid & Orbs ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Gradient orbs */}
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-float-slow"></div>
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] animate-float"></div>

        {/* Vertical lines evenly spaced */}
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-white/[0.03]"
            style={{ left: `${(i + 1) * (100 / 8)}%` }}
          />
        ))}
        {/* Top-to-bottom gradient overlay to darken the top */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/20" />
        {/* Radial glow in centre */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_80%)]" />
      </div>

      {/* ── Main content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center flex flex-col justify-center items-center">
        {/* Crest Logo */}
        <div className="animate-fadeInUp flex justify-center mb-4" style={{ animationDelay: '0ms' }}>
          <div className="relative w-16 h-16 bg-white/5 border border-white/10 rounded-full p-2 backdrop-blur-sm shadow-lg overflow-hidden">
            <Image src={suslLogo} alt="SUSL Crest" className="object-contain" fill />
          </div>
        </div>

        {/* University name */}
        <div className="animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-200 tracking-[0.12em] uppercase leading-tight mb-2">
            Sabaragamuwa University
            <br />
            <span className="tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">of Sri Lanka</span>
          </h1>
        </div>

        {/* Sub-heading */}
        <div className="animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          <p className="text-[10px] sm:text-xs text-indigo-200 font-bold tracking-[0.2em] uppercase mb-6 inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            Results Management System &nbsp;·&nbsp; Faculty of Computing
          </p>
        </div>

        {/* ── Login Card ── */}
        <div className="animate-fadeInUp w-full max-w-2xl" style={{ animationDelay: '300ms' }}>
          <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-8 sm:px-10 sm:py-10 backdrop-blur-md shadow-2xl hover:border-white/20 transition-all duration-500">
            {/* Elegant gradient top accent line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />

            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white mb-3 tracking-tight">
              Access Your Academic Insights Instantly
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-6 max-w-xl mx-auto leading-relaxed font-medium">
              Log in to view GPA analytics, track academic performance, and
              identify rankings and graduation eligibility within the Faculty
              of Computing.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
              <Link
                href="/login?type=student"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-3 rounded-lg font-bold tracking-wider text-xs hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30"
              >
                STUDENT LOGIN
              </Link>
              <Link
                href="/login?type=faculty"
                className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-8 py-3 rounded-lg font-bold tracking-wider text-xs hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
              >
                FACULTY ACCESS
              </Link>
            </div>

            <p className="text-white/40 text-[10px] font-semibold tracking-wide">
              🔒 Secure access for students and academic staff of the Faculty of Computing
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
