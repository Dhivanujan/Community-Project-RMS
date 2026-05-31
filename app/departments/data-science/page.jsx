import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-slate-800">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition"
          >
            SUSL Results Management
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-[550px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
          alt="Data Science"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-blue-950/90 to-slate-950/60">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
            <div className="max-w-4xl">
              <span className="uppercase tracking-[4px] text-blue-300 text-sm">
                Faculty of Computing
              </span>

              <h1 className="text-5xl md:text-6xl font-bold mt-4">
                Department of Data Science
              </h1>

              <p className="mt-6 text-slate-300 text-lg leading-relaxed">
                The Department of Data Science focuses on AI, analytics, and
                data-driven problem solving. Students learn modern machine
                learning techniques, statistical modeling, and scalable data
                engineering to build intelligent systems for real-world impact.
              </p>

              <div className="flex gap-4 mt-8">
                <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition">
                  Student Portal
                </button>

                <button className="border border-blue-400 text-blue-300 px-6 py-3 rounded-lg hover:bg-blue-900/30 transition">
                  View Programs
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Quick Stats */}
        <section className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-blue-400 text-lg font-semibold">
              Established
            </h3>
            <p className="text-3xl font-bold mt-2">2023</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-blue-400 text-lg font-semibold">Faculty</h3>
            <p className="text-3xl font-bold mt-2">Computing</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-blue-400 text-lg font-semibold">
              Annual Intake
            </h3>
            <p className="text-3xl font-bold mt-2">260+</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <h3 className="text-blue-400 text-lg font-semibold">
              Departments
            </h3>
            <p className="text-3xl font-bold mt-2">3</p>
          </div>
        </section>

        {/* About */}
        <section className="mb-16">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-4xl font-bold text-blue-400 mb-6">
              About the Department
            </h2>

            <p className="text-slate-300 leading-8 text-lg mb-5">
              The Department of Data Science delivers a balanced curriculum in
              mathematics, statistics, and computing. Students gain hands-on
              experience with data exploration, model building, and responsible
              AI practices to solve complex problems across industries.
            </p>

            <p className="text-slate-300 leading-8 text-lg">
              The department supports applied research, industry collaboration,
              and innovation in big data systems, intelligent analytics, and
              decision support platforms.
            </p>
          </div>
        </section>

        {/* Research Areas */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-blue-400 mb-8">
            Research Areas
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Machine Learning",
              "Data Mining",
              "Big Data Analytics",
              "Natural Language Processing",
              "Computer Vision",
              "Statistical Modeling",
            ].map((item) => (
              <div
                key={item}
                className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-blue-500 transition"
              >
                <h3 className="text-xl font-semibold mb-3">{item}</h3>

                <p className="text-slate-400">
                  Advanced research and innovation in {item.toLowerCase()} for
                  modern computing solutions.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Programs */}
        <section className="mb-16">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-3xl font-bold text-blue-400">
                Academic Programs
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="text-left p-5">Program</th>
                    <th className="text-left p-5">Duration</th>
                    <th className="text-left p-5">Level</th>
                    <th className="text-left p-5">Status</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-t border-slate-800">
                    <td className="p-5">
                      BSc (Hons) in Data Science
                    </td>
                    <td className="p-5">4 Years</td>
                    <td className="p-5">Undergraduate</td>
                    <td className="p-5">
                      <span className="bg-green-600 px-3 py-1 rounded text-sm">
                        Active
                      </span>
                    </td>
                  </tr>

                  <tr className="border-t border-slate-800">
                    <td className="p-5">
                      Industry Training and Analytics Projects
                    </td>
                    <td className="p-5">Included</td>
                    <td className="p-5">Professional</td>
                    <td className="p-5">
                      <span className="bg-blue-600 px-3 py-1 rounded text-sm">
                        Available
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Faculty Departments */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-blue-400 mb-8">
            Faculty Departments
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h3 className="text-xl font-semibold mb-3">Data Science</h3>
              <p className="text-slate-400">
                AI, machine learning, analytics, and big data technologies.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h3 className="text-xl font-semibold mb-3">
                Software Engineering
              </h3>
              <p className="text-slate-400">
                Software design, architecture, testing, and development.
              </p>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h3 className="text-xl font-semibold mb-3">
                Computing and Information Systems
              </h3>
              <p className="text-slate-400">
                Information systems, enterprise computing, and digital
                transformation.
              </p>
            </div>
          </div>
        </section>

        {/* Student Portal Banner */}
        <section className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl p-10">
          <h2 className="text-3xl font-bold mb-4">
            Student Information System
          </h2>

          <p className="text-blue-100 mb-6">
            Access semester results, academic records, course registration, and
            student services through the centralized SUSL portal.
          </p>

          <div className="flex gap-4">
            <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold">
              View Results
            </button>

            <button className="border border-white px-6 py-3 rounded-lg">
              Student Login
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h3 className="text-2xl font-bold text-blue-400 mb-4">
            Faculty of Computing
          </h3>

          <p className="text-slate-400">
            Sabaragamuwa University of Sri Lanka
          </p>

          <p className="text-slate-400">
            P.O. Box 02, Belihuloya 70140, Sri Lanka
          </p>

          <p className="text-slate-400 mt-2">
            +94 45 2280014 / +94 45 2280087
          </p>

          <p className="text-slate-400">info@sab.ac.lk</p>

          <div className="border-t border-slate-800 mt-6 pt-6 text-slate-500">
            Copyright 2026 Sabaragamuwa University of Sri Lanka. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
