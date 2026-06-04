"use client";

import { useState, useEffect } from "react";
import {
  Users, GraduationCap, UserCog, CheckCircle2, XCircle, FileBarChart2,
  TrendingUp, TrendingDown, Activity, UserPlus, KeyRound, ShieldAlert,
  Database, ArrowRight, Clock, BarChart3
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { CardSkeleton, ChartSkeleton } from "@/components/ui/Skeleton";
import Link from "next/link";

const COLORS = ["#3b82f6", "#8b5cf6", "#e11d48", "#f59e0b"];

function StatCard({ title, value, icon: Icon, trend, trendValue, color, bgColor, loading }) {
  if (loading) return <CardSkeleton />;
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
        </div>
        <div className={`w-11 h-11 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1.5">
          {trend === "up" ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
          )}
          <span className={`text-xs font-semibold ${trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            {trendValue}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">vs last month</span>
        </div>
      )}
    </div>
  );
}

function ActionIcon({ action }) {
  const map = {
    SUCCESSFUL_LOGIN: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    FAILED_LOGIN: { icon: XCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/40" },
    USER_CREATED: { icon: UserPlus, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40" },
    USER_UPDATED: { icon: UserCog, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/40" },
    USER_DELETED: { icon: XCircle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/40" },
    PASSWORD_CHANGE: { icon: KeyRound, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40" },
    SETTINGS_UPDATED: { icon: Activity, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/40" },
    STAFF_CREATION: { icon: UserPlus, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40" },
    STUDENT_CREATION: { icon: GraduationCap, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/40" },
  };
  const config = map[action] || { icon: Activity, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-800" };
  const Icon = config.icon;
  return (
    <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
      <Icon className={`w-4 h-4 ${config.color}`} />
    </div>
  );
}

function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

function tryParseDetails(details) {
  if (!details) return null;
  try {
    return JSON.parse(details);
  } catch {
    return details;
  }
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold" style={{ color: p.color }}>{p.name}: </span>{p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/super-admin/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const stats = data?.stats || {};
  const charts = data?.charts || {};
  const activities = data?.recentActivities || [];

  return (
    <div className="space-y-8 animate-fadeInUp">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">System overview and analytics at a glance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Users" value={stats.totalUsers ?? "—"} icon={Users} color="text-blue-600" bgColor="bg-blue-50 dark:bg-blue-950/40" trend="up" trendValue="+12%" loading={loading} />
        <StatCard title="Students" value={stats.totalStudents ?? "—"} icon={GraduationCap} color="text-violet-600" bgColor="bg-violet-50 dark:bg-violet-950/40" trend="up" trendValue="+8%" loading={loading} />
        <StatCard title="Staff" value={stats.totalStaff ?? "—"} icon={UserCog} color="text-indigo-600" bgColor="bg-indigo-50 dark:bg-indigo-950/40" trend="up" trendValue="+3%" loading={loading} />
        <StatCard title="Active" value={stats.activeUsers ?? "—"} icon={CheckCircle2} color="text-emerald-600" bgColor="bg-emerald-50 dark:bg-emerald-950/40" loading={loading} />
        <StatCard title="Inactive" value={stats.inactiveUsers ?? "—"} icon={XCircle} color="text-red-600" bgColor="bg-red-50 dark:bg-red-950/40" loading={loading} />
        <StatCard title="Published Results" value={stats.publishedResults ?? "—"} icon={FileBarChart2} color="text-amber-600" bgColor="bg-amber-50 dark:bg-amber-950/40" trend="up" trendValue="+5" loading={loading} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[15px] font-bold text-slate-800 dark:text-white">User Growth</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">New registrations over 6 months</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          {loading ? (
            <div className="h-64 bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={charts.userGrowth || []}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2.5} fill="url(#userGrad)" name="Users" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Login Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[15px] font-bold text-slate-800 dark:text-white">Login Activity</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Success vs failed logins (7 days)</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-violet-600" />
            </div>
          </div>
          {loading ? (
            <div className="h-64 bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={charts.loginActivity || []} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="success" fill="#22c55e" name="Success" radius={[6, 6, 0, 0]} />
                <Bar dataKey="failed" fill="#ef4444" name="Failed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Second Row: Role Distribution + Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[15px] font-bold text-slate-800 dark:text-white">Role Distribution</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Users by role type</p>
            </div>
          </div>
          {loading ? (
            <div className="h-52 bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={charts.roleDistribution || []} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={4} strokeWidth={0}>
                    {(charts.roleDistribution || []).map((entry, i) => (
                      <Cell key={i} fill={entry.color || COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {(charts.roleDistribution || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color || COLORS[i] }} />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[15px] font-bold text-slate-800 dark:text-white">Recent Activities</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Latest system events</p>
            </div>
            <Link href="/super-admin/audit-logs" className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-14 bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400 dark:text-slate-500">No recent activities</p>
            </div>
          ) : (
            <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1">
              {activities.slice(0, 10).map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <ActionIcon action={activity.action} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                      {activity.action.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                      by {activity.user} {tryParseDetails(activity.details)?.count ? `• Attempt #${tryParseDetails(activity.details).count}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Clock className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
        <h3 className="text-[15px] font-bold text-slate-800 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/super-admin/users" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Create Staff</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Add new staff account</p>
            </div>
          </Link>

          <Link href="/super-admin/users" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-800 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <KeyRound className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Reset Password</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">User password reset</p>
            </div>
          </Link>

          <Link href="/super-admin/audit-logs" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-violet-200 dark:hover:border-violet-800 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">View Audit Logs</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Monitor activities</p>
            </div>
          </Link>

          <Link href="/super-admin/settings" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Database className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">System Backup</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Backup & maintenance</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
