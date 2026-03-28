import Link from 'next/link';
import { GraduationCap, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 pt-16 pb-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Branding */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="text-blue-600 w-6 h-6" />
              <span className="font-extrabold text-xl tracking-tight text-slate-900">SUSL MeritMatrix.</span>
            </div>
            <p className="text-sm text-slate-500 mb-6 max-w-sm leading-relaxed">
              A dedicated platform for the Faculty of Computing to manage, analyze, and present academic results with unparalleled clarity, security, and precision.
            </p>
          </div>
          {/* Links */}
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-slate-900">Departments</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Software Engineering</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Computing & Info Systems</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Data Science</Link></li>
            </ul>
          </div>
          {/* Contact & Resources */}
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-slate-900">Support</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> support@uniinsight.edu</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> +1 (555) 123-4567</li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Faculty Guidelines</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} SUSL MeritMatrix - Faculty of Computing. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-6 font-medium">
            <Link href="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Security Architecture</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}