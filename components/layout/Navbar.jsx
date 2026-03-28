import Link from 'next/link';
import { GraduationCap, LogIn } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-50 transition-all duration-300 shadow-sm shadow-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm shadow-blue-500/20">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 transition-colors">
                SUSL MeritMatrix<span className="text-blue-600">.</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">SUSL – Faculty of Computing</span>
            </div>
          </Link>
          {/* Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="#home" className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">Home</Link>
            <Link href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">Features</Link>
            <Link href="#departments" className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">Departments</Link>
            <div className="h-6 w-px bg-slate-200"></div>
            <Link href="#login" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all transform hover:-translate-y-0.5 hover:shadow-md shadow-blue-600/20">
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}