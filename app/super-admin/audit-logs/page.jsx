"use client";

import { useState, useEffect, useCallback } from "react";
import { ShieldAlert, Search, Calendar, Filter, Download, Activity, User, Clock, Globe, Monitor, ChevronRight, X, RefreshCw } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import Badge from "@/components/ui/Badge";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

const ACTION_COLORS = {
  SUCCESSFUL_LOGIN: "success", FAILED_LOGIN: "danger", USER_CREATED: "info",
  USER_UPDATED: "purple", USER_DELETED: "danger", PASSWORD_CHANGE: "warning",
  SETTINGS_UPDATED: "info", STAFF_CREATION: "info", STUDENT_CREATION: "info",
};

export default function AuditLogsPage() {
  const toast = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [actionTypes, setActionTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set("search", search);
      if (actionFilter) params.set("action", actionFilter);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      const res = await fetch(`/api/super-admin/audit-logs?${params}`);
      const data = await res.json();
      if (res.ok) { setLogs(data.logs); setPagination(data.pagination); setActionTypes(data.actionTypes || []); }
    } catch { toast.error("Failed to fetch logs"); }
    finally { setLoading(false); }
  }, [search, actionFilter, dateFrom, dateTo]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const exportLogs = () => {
    const headers = ["Timestamp", "User", "Action", "Entity", "Details", "IP Address", "Status"];
    const rows = logs.map(l => [
      new Date(l.createdAt).toLocaleString(), l.user, l.action,
      l.entity || "N/A", l.details || "N/A", l.ipAddress || "N/A", l.status
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast.success("Logs exported successfully");
  };

  const clearFilters = () => { setSearch(""); setActionFilter(""); setDateFrom(""); setDateTo(""); };

  const tryParse = (str) => { try { return JSON.parse(str); } catch { return str; } };

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Audit Logs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive trail of all system activities and security events.</p>
        </div>
        <button onClick={exportLogs} className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Table */}
        <div className={`flex-1 ${selectedLog ? 'lg:w-3/5' : 'w-full'} transition-all`}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            {/* Filters */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[180px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400" />
                </div>
                <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}
                  className="px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20">
                  <option value="">All Actions</option>
                  {actionTypes.map(a => <option key={a} value={a}>{a.replace(/_/g, " ")}</option>)}
                </select>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                  className="px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                  className="px-3 py-2.5 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
                {(search || actionFilter || dateFrom || dateTo) && (
                  <button onClick={clearFilters} className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors" title="Clear filters">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => fetchLogs()} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <RefreshCw className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Table */}
            {loading ? <div className="p-4"><TableSkeleton rows={8} cols={5} /></div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium">
                    <tr>
                      <th className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">Event</th>
                      <th className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">User</th>
                      <th className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 hidden md:table-cell">Entity</th>
                      <th className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">Status</th>
                      <th className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">Timestamp</th>
                      <th className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {logs.length === 0 ? (
                      <tr><td colSpan="6" className="px-6 py-16 text-center">
                        <ShieldAlert className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">No audit logs found</p>
                      </td></tr>
                    ) : logs.map((log) => (
                      <tr key={log.id} onClick={() => setSelectedLog(log)} className={`cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors ${selectedLog?.id === log.id ? 'bg-rose-50/50 dark:bg-rose-950/10' : ''}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                              <Activity className="w-4 h-4 text-slate-500" />
                            </div>
                            <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">{log.action.replace(/_/g, " ")}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-slate-600 dark:text-slate-300 text-xs font-medium">{log.user}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          {log.entity ? <Badge variant="default">{log.entity}</Badge> : <span className="text-slate-400 text-xs">—</span>}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant={log.status === "success" ? "success" : "danger"}>{log.status}</Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-slate-500 dark:text-slate-400 text-xs">{new Date(log.createdAt).toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="border-t border-slate-100 dark:border-slate-800 px-4">
              <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={(p) => fetchLogs(p)} totalItems={pagination.total} itemsPerPage={pagination.limit} />
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedLog && (
          <div className="lg:w-2/5 shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 sticky top-24 animate-fadeIn">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] font-bold text-slate-800 dark:text-white">Activity Details</h3>
                <button onClick={() => setSelectedLog(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { l: "Action", v: selectedLog.action.replace(/_/g, " "), icon: Activity },
                  { l: "User", v: selectedLog.user, icon: User },
                  { l: "Entity", v: selectedLog.entity || "N/A", icon: ShieldAlert },
                  { l: "IP Address", v: selectedLog.ipAddress || "N/A", icon: Globe },
                  { l: "User Agent", v: selectedLog.userAgent || "N/A", icon: Monitor },
                  { l: "Timestamp", v: new Date(selectedLog.createdAt).toLocaleString(), icon: Clock },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{item.l}</p>
                      <p className="text-sm text-slate-700 dark:text-slate-200 font-medium mt-0.5 break-all">{item.v}</p>
                    </div>
                  </div>
                ))}

                {/* Status */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldAlert className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</p>
                    <Badge variant={selectedLog.status === "success" ? "success" : "danger"} className="mt-1">{selectedLog.status}</Badge>
                  </div>
                </div>

                {/* Details */}
                {selectedLog.details && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Details</p>
                    <pre className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-xl p-3 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(tryParse(selectedLog.details), null, 2)}
                    </pre>
                  </div>
                )}

                {/* Before/After Changes */}
                {(selectedLog.oldValues || selectedLog.newValues) && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Changes</p>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedLog.oldValues && (
                        <div>
                          <p className="text-[10px] font-bold text-red-500 uppercase mb-1">Before</p>
                          <pre className="text-xs text-slate-600 dark:text-slate-300 bg-red-50/50 dark:bg-red-950/20 rounded-lg p-2.5 overflow-x-auto whitespace-pre-wrap border border-red-100 dark:border-red-900/30">
                            {JSON.stringify(tryParse(selectedLog.oldValues), null, 2)}
                          </pre>
                        </div>
                      )}
                      {selectedLog.newValues && (
                        <div>
                          <p className="text-[10px] font-bold text-emerald-500 uppercase mb-1">After</p>
                          <pre className="text-xs text-slate-600 dark:text-slate-300 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg p-2.5 overflow-x-auto whitespace-pre-wrap border border-emerald-100 dark:border-emerald-900/30">
                            {JSON.stringify(tryParse(selectedLog.newValues), null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
