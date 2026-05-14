import { Users, ShieldAlert, CheckCircle2, ShieldOff, Activity } from 'lucide-react';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import AuditLog from '@/models/AuditLog';

// Helper Component for Dashboard Cards
function DashboardCard({ title, value, icon, bgColor }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor}`}>
        {icon}
      </div>
    </div>
  );
}

export default async function SuperAdminDashboard() {
  await dbConnect();

  // Fetch counts
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const inactiveUsers = totalUsers - activeUsers;
  const recentLogs = await AuditLog.find().sort({ createdAt: -1 }).limit(5).lean();

  const serializedLogs = recentLogs.map((log) => ({
    ...log,
    _id: log._id.toString(),
    createdAt: log.createdAt?.toISOString() || null,
  }));

  return (
    <div className="w-full h-full space-y-8">
      <header>
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight leading-[1.15]">
          System Control Center
        </h1>
        <p className="mt-3 text-slate-500 text-sm font-medium">
          Monitor system health, manage administrative users, and view security logs.
        </p>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Users"
          value={totalUsers.toString()}
          icon={<Users className="w-6 h-6 text-white" />}
          bgColor="bg-blue-600"
        />
        <DashboardCard
          title="Active Accounts"
          value={activeUsers.toString()}
          icon={<CheckCircle2 className="w-6 h-6 text-white" />}
          bgColor="bg-emerald-500"
        />
        <DashboardCard
          title="Inactive Accounts"
          value={inactiveUsers.toString()}
          icon={<ShieldOff className="w-6 h-6 text-white" />}
          bgColor="bg-rose-500"
        />
        <DashboardCard
          title="System Alerts"
          value="0"
          icon={<Activity className="w-6 h-6 text-white" />}
          bgColor="bg-amber-500"
        />
      </div>

      {/* Recent Audit Logs */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <h2 className="text-lg font-bold text-slate-800">Recent Security Events</h2>
        </div>
        {serializedLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <CheckCircle2 className="w-10 h-10 text-slate-200" />
            <p className="text-sm text-slate-500">No security events found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {serializedLogs.map((item) => (
              <div
                key={item._id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
              >
                <div className="mt-0.5 w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.action}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.entity} - {item.details ? JSON.stringify(item.details) : "No details"}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-500 font-medium">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
