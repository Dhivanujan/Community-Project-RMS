export default function Features() {
  return (
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
  );
}