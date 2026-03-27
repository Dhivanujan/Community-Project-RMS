import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 bg-surface border-b border-border z-50 smooth-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded bg-opacity-10 flex items-center justify-center">
              <i className="fa-solid fa-graduation-cap text-primary"></i>
            </div>
            <span className="font-bold text-xl tracking-tight text-primary">UniInsight</span>
          </div>
          {/* Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="#home" className="text-textMuted hover:text-primary font-medium transition-colors">Home</Link>
            <Link href="#features" className="text-textMuted hover:text-primary font-medium transition-colors">Features</Link>
            <Link href="#departments" className="text-textMuted hover:text-primary font-medium transition-colors">Departments</Link>
            <Link href="#login" className="bg-primary hover:bg-primaryHover text-white px-5 py-2 rounded-md font-medium transition-colors">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}