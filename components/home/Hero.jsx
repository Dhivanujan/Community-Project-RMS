import Link from 'next/link';

export default function Hero() {
  return (
    <section id="home" className="relative bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Side */}
        <div className="flex-1 text-center lg:text-left opacity-0 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Smart Results Management for <span className="text-primary relative inline-block">
              Modern Universities
              <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 -z-10 rounded-sm opacity-50 transform -skew-x-12"></span>
            </span>
          </h1>
          <p className="text-lg text-textMuted mb-8 max-w-2xl mx-auto lg:mx-0">
            Empowering the Faculty of Computing with intelligent GPA automation, real-time student ranking, and predictive academic analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="#login" className="bg-primary hover:bg-primaryHover text-white px-8 py-3 rounded-md font-medium transition-all transform hover:-translate-y-1 hover:shadow-lg inline-block">Login</Link>
            <Link href="#features" className="bg-white border border-border text-textDark hover:bg-gray-50 px-8 py-3 rounded-md font-medium transition-all transform hover:-translate-y-1 hover:shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] inline-block">Explore Features</Link>
          </div>
        </div>
        {/* Right Side (Dashboard Mockup) */}
        <div className="flex-1 w-full max-w-xl relative opacity-0 animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <div className="bg-white border border-border rounded-xl shadow-xl p-6 relative z-10 transition-transform duration-500 hover:scale-[1.02]">
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
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-50 rounded-full z-0 animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gray-100 rounded-full z-0 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </section>
  );
}