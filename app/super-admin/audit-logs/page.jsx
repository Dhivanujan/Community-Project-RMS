"use client";

import { useState, useEffect } from 'react';
import { ShieldAlert, Calendar, User, Activity } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/super-admin/audit-logs');
        const data = await res.json();
        if (res.ok) setLogs(data.logs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="w-full h-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Audit Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Comprehensive trail of all system activities and security events.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-3 border-b border-slate-100">Event</th>
                <th className="px-6 py-3 border-b border-slate-100">User</th>
                <th className="px-6 py-3 border-b border-slate-100">Entity</th>
                <th className="px-6 py-3 border-b border-slate-100">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-400">Loading logs...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-400">No audit logs found.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <Activity className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{log.action}</p>
                          <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{log.details ? JSON.stringify(log.details) : 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 font-medium">{log.userId?.name || 'System'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
                        {log.entity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
