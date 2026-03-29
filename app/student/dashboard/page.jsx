export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-surface font-body text-on-surface">
      
      {/* Sidebar */}
      <aside className="w-64 h-screen sticky top-0 bg-[#f0f4f7] flex flex-col py-8 px-4">
        <div className="mb-10 px-4">
          <h1 className="text-lg font-bold text-[#3856c4]">
            Faculty of Computing
          </h1>
          <p className="text-xs text-slate-500">Results Management</p>
        </div>

        <nav className="flex-1 space-y-1">
          <a className="flex items-center gap-3 px-4 py-3 border-l-4 border-[#3856c4] text-[#3856c4] font-semibold bg-white/50">
            Dashboard
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-[#3856c4]">
            Results
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-[#3856c4]">
            GPA Summary
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-[#3856c4]">
            Notifications
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">

        {/* Header */}
        <header className="sticky top-0 bg-white flex justify-between items-center px-8 py-4 shadow-sm">
          <input
            className="w-full max-w-md bg-gray-100 rounded-full py-2 px-4"
            placeholder="Search..."
          />

          <div className="flex items-center gap-4">
            <p className="font-semibold">Alex Thompson</p>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-10">

          {/* Welcome */}
          <section>
            <h2 className="text-4xl font-bold">Welcome back, Alex</h2>
            <p className="text-gray-500">
              Here is your academic performance.
            </p>
          </section>

          {/* Cards */}
          <section className="grid md:grid-cols-3 gap-6">

            {/* GPA */}
            <div className="bg-blue-600 text-white p-8 rounded-xl">
              <p>Current GPA</p>
              <h3 className="text-5xl font-bold mt-2">3.82</h3>
              <p className="mt-4 text-sm">Top 5%</p>
            </div>

            {/* Subjects */}
            <div className="bg-white p-8 rounded-xl shadow">
              <p>Completed Subjects</p>
              <h3 className="text-4xl font-bold mt-2">24 / 32</h3>
            </div>

            {/* Pending */}
            <div className="bg-white p-8 rounded-xl shadow">
              <p>Pending Results</p>
              <h3 className="text-4xl font-bold mt-2">03</h3>
            </div>

          </section>

          {/* Table */}
          <section>
            <h4 className="text-2xl font-bold mb-4">Current Semester</h4>

            <table className="w-full bg-white rounded-xl overflow-hidden">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-4">Code</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Grade</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-4">CS102</td>
                  <td className="p-4">Intro to Algorithms</td>
                  <td className="p-4 font-bold">A+</td>
                  <td className="p-4 text-right">Published</td>
                </tr>

                <tr className="border-t">
                  <td className="p-4">CS204</td>
                  <td className="p-4">Database Management</td>
                  <td className="p-4 font-bold">A</td>
                  <td className="p-4 text-right">Published</td>
                </tr>

                <tr className="border-t">
                  <td className="p-4">MT101</td>
                  <td className="p-4">Discrete Mathematics</td>
                  <td className="p-4">—</td>
                  <td className="p-4 text-right">Evaluating</td>
                </tr>

                <tr className="border-t">
                  <td className="p-4">CS208</td>
                  <td className="p-4">Computer Networks</td>
                  <td className="p-4">—</td>
                  <td className="p-4 text-right">In Progress</td>
                </tr>
              </tbody>
            </table>
          </section>

        </div>
      </main>
    </div>
  );
}