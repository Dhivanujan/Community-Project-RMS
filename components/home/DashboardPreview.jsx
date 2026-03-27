export default function DashboardPreview() {
  return (
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
  );
}