import { ArrowRight, UserCircle, Presentation } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 bg-slate-900 relative border-y border-slate-800 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-white">Simplify Academic Management Today</h2>
        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">Access your personalized, secure dashboard to view insights, rankings, and automated university results seamlessly.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-900/30 focus:outline-none">
            <UserCircle className="w-5 h-5" />
            Login as Student
          </button>
          <button className="flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 px-8 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 shadow-lg shadow-slate-900/40 focus:outline-none">
            <Presentation className="w-5 h-5 text-blue-400" />
            Login as Faculty
          </button>
        </div>
      </div>
    </section>
  );
}