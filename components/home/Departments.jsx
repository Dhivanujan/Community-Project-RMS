export default function Departments() {
  return (
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
  );
}