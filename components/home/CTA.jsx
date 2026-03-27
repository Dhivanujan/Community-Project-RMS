export default function CTA() {
  return (
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
  );
}