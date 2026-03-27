import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface pt-16 pb-8 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Branding */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <i className="fa-solid fa-graduation-cap text-primary text-xl"></i>
              <span className="font-bold text-lg tracking-tight text-textDark">UniInsight</span>
            </div>
            <p className="text-sm text-textMuted mb-6 max-w-sm">
              A dedicated platform for the Faculty of Computing to manage, analyze, and present academic results with unparalleled clarity and precision.
            </p>
          </div>
          {/* Links */}
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">Departments</h4>
            <ul className="space-y-3 text-sm text-textMuted">
              <li><Link href="#" className="hover:text-primary transition-colors">Software Engineering</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Computing & Info Systems</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Data Science</Link></li>
            </ul>
          </div>
          {/* Contact & Resources */}
          <div>
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm text-textMuted">
              <li className="flex items-center gap-2"><i className="fa-solid fa-envelope w-4 text-center"></i> support@uniinsight.edu</li>
              <li className="flex items-center gap-2"><i className="fa-solid fa-phone w-4 text-center"></i> +1 (555) 123-4567</li>
              <li><Link href="#" className="hover:text-primary transition-colors">Faculty Guidelines</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-textMuted">
          <p>&copy; 2026 UniInsight - Faculty of Computing. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link href="#" className="hover:text-textDark transition-colors">Terms</Link>
            <Link href="#" className="hover:text-textDark transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}