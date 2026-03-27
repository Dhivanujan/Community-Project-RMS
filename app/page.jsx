import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* 1. Top Navigation Bar */}
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

      {/* 2. Hero Section */}
      <section id="home" className="relative bg-surface overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Smart Results Management for <span className="text-primary">Modern Universities</span>
            </h1>
            <p className="text-lg text-textMuted mb-8 max-w-2xl mx-auto lg:mx-0">
              Empowering the Faculty of Computing with intelligent GPA automation, real-time student ranking, and predictive academic analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="#login" className="bg-primary hover:bg-primaryHover text-white px-8 py-3 rounded-md font-medium transition-colors shadow-sm inline-block">Login</Link>
              <Link href="#features" className="bg-white border border-border text-textDark hover:bg-gray-50 px-8 py-3 rounded-md font-medium transition-colors shadow-sm inline-block">Explore Features</Link>
            </div>
          </div>
          {/* Right Side (Dashboard Mockup) */}
          <div className="flex-1 w-full max-w-xl relative">
            <div className="bg-white border border-border rounded-xl shadow-lg p-6 relative z-10">
              {/* Fake Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
                <div className="font-semibold text-textMuted">Overview</div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              {/* Fake Content */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-xs text-blue-600 font-semibold uppercase mb-1">Average GPA</div>
                  <div className="text-2xl font-bold">3.42</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-xs text-green-600 font-semibold uppercase mb-1">Class Holders</div>
                  <div className="text-2xl font-bold">128</div>
                </div>
              </div>
              <div className="h-32 bg-gray-50 rounded border border-gray-100 flex items-end px-4 gap-2 pt-8 relative w-full">
                <div className="absolute inset-0 flex items-center justify-center text-textMuted opacity-50 text-sm">GPA Trend Analytics</div>
                <div className="flex-1 bg-blue-200 rounded-t h-1/3"></div>
                <div className="flex-1 bg-blue-300 rounded-t h-1/2"></div>
                <div className="flex-1 bg-blue-400 rounded-t h-2/3"></div>
                <div className="flex-1 bg-primary rounded-t h-full"></div>
              </div>
            </div>
            {/* Decorative background elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-50 rounded-full z-0"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gray-100 rounded-full z-0"></div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core Academic Features</h2>
            <p className="text-textMuted max-w-2xl mx-auto">Designed specifically for computing departments to streamline grading and identify student potential.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-surface p-8 rounded-xl border border-border hover-lift">
              <div className="w-12 h-12 bg-blue-50 text-primary rounded-lg flex items-center justify-center text-xl mb-6">
                <i className="fa-solid fa-calculator"></i>
              </div>
              <h3 className="font-bold text-lg mb-3">GPA Automation</h3>
              <p className="text-textMuted text-sm leading-relaxed">Instantly calculate semester and cumulative GPAs with precision, eliminating manual spreadsheet errors.</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-surface p-8 rounded-xl border border-border hover-lift">
              <div className="w-12 h-12 bg-blue-50 text-primary rounded-lg flex items-center justify-center text-xl mb-6">
                <i className="fa-solid fa-ranking-star"></i>
              </div>
              <h3 className="font-bold text-lg mb-3">Academic Ranking</h3>
              <p className="text-textMuted text-sm leading-relaxed">Automated batch ranking systems to identify top performers across different computing disciplines.</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-surface p-8 rounded-xl border border-border hover-lift">
              <div className="w-12 h-12 bg-blue-50 text-primary rounded-lg flex items-center justify-center text-xl mb-6">
                <i className="fa-solid fa-medal"></i>
              </div>
              <h3 className="font-bold text-lg mb-3">Class Identification</h3>
              <p className="text-textMuted text-sm leading-relaxed">Predict and identify potential First Class and Second Class Upper graduates early in their degree.</p>
            </div>
            {/* Feature 4 */}
            <div className="bg-surface p-8 rounded-xl border border-border hover-lift">
              <div className="w-12 h-12 bg-blue-50 text-primary rounded-lg flex items-center justify-center text-xl mb-6">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <h3 className="font-bold text-lg mb-3">Early Warning System</h3>
              <p className="text-textMuted text-sm leading-relaxed">Flag students at risk of academic failure or probation, enabling timely faculty intervention.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Departments Section */}
      <section id="departments" className="py-20 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Faculty of Computing</h2>
            <p className="text-textMuted max-w-2xl mx-auto">Supporting diverse computing disciplines with tailored evaluation criteria.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* SE */}
            <div className="bg-background rounded-xl p-6 border border-border hover-lift flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-white rounded shadow-sm flex items-center justify-center text-primary">
                  <i className="fa-solid fa-code"></i>
                </div>
                <h3 className="font-bold text-lg">Software Engineering</h3>
              </div>
              <div className="mt-auto border-t border-border pt-4 flex justify-between text-sm text-textMuted">
                <span>Students: <strong>850</strong></span>
                <span>Avg GPA: <strong>3.45</strong></span>
              </div>
            </div>
            {/* CIS */}
            <div className="bg-background rounded-xl p-6 border border-border hover-lift flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-white rounded shadow-sm flex items-center justify-center text-primary">
                  <i className="fa-solid fa-network-wired"></i>
                </div>
                <h3 className="font-bold text-lg">Computing & Info Systems</h3>
              </div>
              <div className="mt-auto border-t border-border pt-4 flex justify-between text-sm text-textMuted">
                <span>Students: <strong>620</strong></span>
                <span>Avg GPA: <strong>3.38</strong></span>
              </div>
            </div>
            {/* DS */}
            <div className="bg-background rounded-xl p-6 border border-border hover-lift flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-white rounded shadow-sm flex items-center justify-center text-primary">
                  <i className="fa-solid fa-database"></i>
                </div>
                <h3 className="font-bold text-lg">Data Science</h3>
              </div>
              <div className="mt-auto border-t border-border pt-4 flex justify-between text-sm text-textMuted">
                <span>Students: <strong>410</strong></span>
                <span>Avg GPA: <strong>3.52</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Dashboard Preview Section */}
      <section className="py-20 bg-background overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Analytics</h2>
            <p className="text-textMuted max-w-2xl mx-auto">Get a bird&apos;s-eye view of academic performance across cohorts.</p>
          </div>
          
          <div className="bg-surface border border-border rounded-xl shadow-lg mx-auto w-full max-w-5xl">
            {/* Mockup Window header */}
            <div className="bg-gray-50 border-b border-border p-3 rounded-t-xl flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="mx-auto bg-white border border-gray-200 rounded px-24 py-1 flex items-center justify-center text-xs text-gray-400">
                uniinsight.edu/dashboard
              </div>
            </div>
            
            {/* Mockup body */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 bg-surface rounded-b-xl">
              {/* Left Sidebar (Leaderboard) */}
              <div className="w-full md:w-1/3 border border-border rounded-lg p-5">
                <h4 className="font-semibold mb-4 text-sm uppercase text-textMuted tracking-wider">Top Performers</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">1</div>
                      <div className="text-sm font-medium">Alice Smith</div>
                    </div>
                    <div className="font-bold text-primary">3.98</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">2</div>
                      <div className="text-sm font-medium">John Doe</div>
                    </div>
                    <div className="font-bold text-primary">3.95</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">3</div>
                      <div className="text-sm font-medium">Emma Watson</div>
                    </div>
                    <div className="font-bold text-primary">3.91</div>
                  </div>
                </div>
              </div>
              
              {/* Right Content (Charts) */}
              <div className="w-full md:w-2/3 flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 border border-border rounded-lg p-4">
                    <div className="text-xs text-textMuted mb-1">Total Verified</div>
                    <div className="text-xl font-bold">1,880</div>
                  </div>
                  <div className="bg-gray-50 border border-border rounded-lg p-4">
                    <div className="text-xs text-textMuted mb-1">Pending Approval</div>
                    <div className="text-xl font-bold text-yellow-600">42</div>
                  </div>
                  <div className="bg-gray-50 border border-border rounded-lg p-4">
                    <div className="text-xs text-textMuted mb-1">System Alerts</div>
                    <div className="text-xl font-bold text-red-500">7</div>
                  </div>
                </div>
                <div className="border border-border rounded-lg p-5 relative min-h-[200px] flex items-center justify-center">
                  <span className="text-textMuted font-medium absolute top-4 left-5 text-sm">Batch GPA Distribution</span>
                  {/* Simplified bars */}
                  <div className="flex items-end gap-2 w-full h-32 mt-8 justify-around px-4">
                    <div className="w-8 bg-blue-100 rounded-t h-[20%] relative group"><span className="absolute -top-6 text-xs text-gray-400 hidden group-hover:block w-full text-center">2%</span></div>
                    <div className="w-8 bg-blue-200 rounded-t h-[35%] relative group"><span className="absolute -top-6 text-xs text-gray-400 hidden group-hover:block w-full text-center">15%</span></div>
                    <div className="w-8 bg-blue-300 rounded-t h-[60%] relative group"><span className="absolute -top-6 text-xs text-gray-400 hidden group-hover:block w-full text-center">38%</span></div>
                    <div className="w-8 bg-blue-500 rounded-t h-[80%] relative group"><span className="absolute -top-6 text-xs text-gray-400 hidden group-hover:block w-full text-center">25%</span></div>
                    <div className="w-8 bg-primary rounded-t h-[45%] relative group"><span className="absolute -top-6 text-xs text-gray-400 hidden group-hover:block w-full text-center">20%</span></div>
                  </div>
                  <div className="absolute bottom-2 w-full flex justify-around px-8 text-[10px] text-gray-400 font-medium tracking-wider">
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

      {/* 6. Call To Action */}
      <section className="py-20 bg-blue-50 relative border-y border-blue-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Simplify Academic Management Today</h2>
          <p className="text-lg text-textMuted mb-8">Access your personalized dashboard to view insights, rankings, and automated results.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-primary hover:bg-primaryHover text-white px-8 py-3 rounded-md font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Login as Student
            </button>
            <button className="bg-white border-2 border-primary text-primary hover:bg-blue-50 px-8 py-3 rounded-md font-medium transition-colors shadow-sm focus:outline-none">
              Login as Lecturer
            </button>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
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
    </>
  );
}