import { UserCircle, Presentation, ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 bg-slate-900 border-y border-slate-800">
      <div className="max-w-4xl mx-auto text-center px-4">
        
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
          Access Your Academic Insights Instantly
        </h2>

        {/* Description */}
        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
          Log in to view GPA analytics, track academic performance, and identify
          rankings and graduation eligibility within the Faculty of Computing.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          
          {/* Student Login */}
          <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:-translate-y-1 shadow-lg shadow-blue-900/30">
            <UserCircle className="w-5 h-5" />
            Student Login
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Faculty Login */}
          <button className="flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 px-8 py-4 rounded-xl font-semibold transition-all hover:-translate-y-1 shadow-lg shadow-slate-900/40">
            <Presentation className="w-5 h-5 text-blue-400" />
            Faculty Access
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

        {/* Extra Trust Line (NEW - very important) */}
        <p className="text-xs text-slate-500 mt-8">
          Secure access for students and academic staff of the Faculty of Computing
        </p>
      </div>
    </section>
  );
}