"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from 'recharts';
import { Loader2, TrendingUp, Users, FileText, BarChart3, ChevronDown, Filter, Trophy, Medal, Award } from 'lucide-react';
import { DEPARTMENTS, ACADEMIC_YEARS, BATCHES, SEMESTERS, GRADE_POINT_MAP } from '@/lib/resultUpload/config';

const DEPT_COLORS_CHART = {
  'Software Engineering': '#3B82F6',
  'Computer Information Systems': '#8B5CF6',
  'Data Science': '#10B981',
};

const GRADE_PIE_COLORS = [
  '#10B981', '#34D399', '#6EE7B7',
  '#3B82F6', '#60A5FA', '#93C5FD',
  '#8B5CF6', '#A78BFA', '#C4B5FD',
  '#F59E0B', '#FBBF24',
  '#EF4444', '#DC2626',
];

function StatCard({ icon: Icon, label, value, sub, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary text-white shadow-primary/20',
    blue: 'bg-primary-500/80 text-white shadow-blue-500/20',
    green: 'bg-emerald-500/80 text-white shadow-emerald-500/20',
    purple: 'bg-violet-500/80 text-white shadow-violet-500/20',
  };
  return (
    <div className="flex items-center gap-4 p-6 bg-surface/80 glass-card rounded-3xl shadow-sm border border-border hover-lift card-glow transition-all duration-300 group">
      <div className={`w-12 h-12 flex items-center justify-center rounded-xl shadow-md ${colors[color]} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-textMuted font-medium text-sm group-hover:text-primary transition-colors">{label}</p>
        <h3 className="text-textDark font-bold text-2xl">{value}</h3>
        {sub && <p className="text-textMuted text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function EmptyState({ message = 'No data available yet.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <div className="p-4 bg-primary/5 rounded-full">
        <BarChart3 className="w-10 h-10 text-primary/40" />
      </div>
      <p className="text-textMuted text-sm font-medium">{message}</p>
    </div>
  );
}

function RankIcon({ rank }) {
  if (rank === 1) return <Trophy className="w-5 h-5 text-secondary-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-amber-700" />;
  return <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-textMuted">#{rank}</span>;
}

function GpaTag({ gpa }) {
  const color =
    gpa >= 3.7 ? 'bg-emerald-100 text-emerald-700'
    : gpa >= 3.3 ? 'bg-primary-100 text-primary-700'
    : gpa >= 2.7 ? 'bg-violet-100 text-violet-700'
    : gpa >= 2.0 ? 'bg-amber-100 text-amber-700'
    : 'bg-red-100 text-red-700';
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>
      {gpa.toFixed(2)}
    </span>
  );
}

export default function GPAReportsManager() {
  const [filters, setFilters] = useState({ department: '', academicYear: '', batch: '', semester: '' });
  const [studentIdSearch, setStudentIdSearch] = useState('');
  const [activeTab, setActiveTab] = useState('management');
  const [expandedRow, setExpandedRow] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      if (studentIdSearch) params.set('studentId', studentIdSearch);
      const res = await fetch(`/api/admin/gpa-reports?${params.toString()}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setData(json.data);
    } catch (err) {
      setError(err.message || 'Failed to load GPA data.');
    } finally {
      setLoading(false);
    }
  }, [filters, studentIdSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilter = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }));

  const SelectFilter = ({ label, icon: Icon, stateKey, options }) => (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none" />}
      <select
        value={filters[stateKey]}
        onChange={(e) => handleFilter(stateKey, e.target.value)}
        className="pl-9 pr-8 py-2.5 bg-background border border-border rounded-xl text-sm text-textDark outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 appearance-none transition-all cursor-pointer"
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
            {typeof o === 'string' ? o : o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-textMuted pointer-events-none" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Filter Bar */}
      <div className="bg-surface/80 glass-card rounded-2xl border border-border shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-textMuted" />
        <SelectFilter label="All Departments" icon={null} stateKey="department" options={DEPARTMENTS} />
        <SelectFilter label="Academic Year" icon={null} stateKey="academicYear" options={ACADEMIC_YEARS} />
        <SelectFilter label="Semester" icon={null} stateKey="semester" options={SEMESTERS} />
        
        {/* Search by Student ID */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search Student ID..."
            value={studentIdSearch}
            onChange={(e) => setStudentIdSearch(e.target.value)}
            className="pl-3 pr-8 py-2 bg-background border border-border rounded-xl text-sm text-textDark outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all max-w-[150px]"
          />
        </div>

        <button
          onClick={() => {
            setFilters({ department: '', academicYear: '', semester: '' });
            setStudentIdSearch('');
          }}
          className="text-xs font-semibold text-textMuted hover:text-red-500 px-3 py-2 rounded-lg hover:bg-red-50 transition-all"
        >
          Clear
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-border gap-4">
        <button
          onClick={() => setActiveTab('management')}
          className={`pb-3 px-2 font-bold text-sm border-b-2 transition-all ${activeTab === 'management' ? 'border-[#d4a843] text-[#d4a843]' : 'border-transparent text-textMuted hover:text-textDark'}`}
        >
          Student GPA Records
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-2 font-bold text-sm border-b-2 transition-all ${activeTab === 'analytics' ? 'border-[#d4a843] text-[#d4a843]' : 'border-transparent text-textMuted hover:text-textDark'}`}
        >
          Performance Dashboard
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Content */}
      {!loading && !error && data && (
        <>
          {/* GPA Management Tab */}
          {activeTab === 'management' && (
            <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden p-6 animate-fadeInUp">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-textDark font-bold text-base">Student GPA Records</h3>
                <span className="text-xs text-textMuted font-medium bg-slate-50 border border-border px-3 py-1.5 rounded-xl">
                  {data.gpaRecords ? data.gpaRecords.length : 0} student(s) found
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-border text-[11px] font-bold text-textMuted uppercase tracking-wider bg-slate-50/50">
                      <th className="py-4 px-4 w-12 text-center">Breakdown</th>
                      <th className="py-4 px-4">Student ID</th>
                      <th className="py-4 px-4">Batch</th>
                      <th className="py-4 px-4">Department</th>
                      <th className="py-4 px-4">Current GPA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm">
                    {data.gpaRecords && data.gpaRecords.length > 0 ? (
                      data.gpaRecords.map((record) => (
                        <>
                          <tr 
                            key={record._id} 
                            onClick={() => setExpandedRow(expandedRow === record._id ? null : record._id)}
                            className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                          >
                            <td className="py-4 px-4 text-center">
                              <span className="text-xs text-textMuted font-bold">
                                {expandedRow === record._id ? '▼' : '▶'}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-semibold text-textDark">{record.studentId}</td>
                            <td className="py-4 px-4 text-textMuted">{record.batch}</td>
                            <td className="py-4 px-4 text-textMuted">{record.department}</td>
                            <td className="py-4 px-4">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                record.currentGPA >= 3.7 ? 'bg-emerald-100 text-emerald-700'
                                : record.currentGPA >= 3.3 ? 'bg-blue-100 text-blue-700'
                                : record.currentGPA >= 2.7 ? 'bg-violet-100 text-violet-700'
                                : record.currentGPA >= 2.0 ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                              }`}>
                                {record.currentGPA.toFixed(2)}
                              </span>
                            </td>
                          </tr>
                          {expandedRow === record._id && (
                            <tr key={`${record._id}-expanded`}>
                              <td colSpan={5} className="bg-slate-50/50 p-6 border-t border-b border-border">
                                <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-4 max-w-3xl animate-fadeIn">
                                  <div className="flex justify-between items-center border-b border-border pb-3">
                                    <h4 className="font-bold text-sm text-textDark">Subject Grade Breakdown</h4>
                                    <span className="text-xs font-bold text-textDark bg-slate-100 border border-border px-3 py-1.5 rounded-xl">
                                      Total Credits: <span className="text-primary font-extrabold">{record.totalCredits}</span>
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 gap-4 text-xs font-bold text-textMuted border-b border-slate-100 pb-2">
                                    <div>Subject</div>
                                    <div className="text-center">Credits</div>
                                    <div className="text-center">Grade</div>
                                    <div className="text-center">Grade Point</div>
                                  </div>
                                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {record.publishedSubjects.map((sub, idx) => (
                                      <div key={idx} className="grid grid-cols-4 gap-4 text-xs text-textDark items-center py-2.5 border-b border-slate-50 last:border-b-0">
                                        <div className="font-medium">{sub}</div>
                                        <div className="text-center">{record.credits[idx]}</div>
                                        <div className="text-center font-bold">
                                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded ${
                                            record.grades[idx].startsWith('A') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                            : record.grades[idx].startsWith('B') ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                            : record.grades[idx].startsWith('C') ? 'bg-violet-50 text-violet-700 border border-violet-100'
                                            : 'bg-red-50 text-red-700 border border-red-100'
                                          }`}>
                                            {record.grades[idx]}
                                          </span>
                                        </div>
                                        <div className="text-center font-bold text-textMuted">
                                          {GRADE_POINT_MAP[record.grades[idx]] !== undefined ? GRADE_POINT_MAP[record.grades[idx]].toFixed(1) : '-'}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-textMuted font-medium">
                          No GPA records found matching the filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* GPA Analytics Tab */}
          {activeTab === 'analytics' && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard icon={FileText} label="Published Results" value={data.summary.totalPublished} color="primary" />
                <StatCard icon={Users} label="Unique Students" value={data.summary.uniqueStudents} color="blue" />
                <StatCard icon={BarChart3} label="Total Entries" value={data.summary.totalEntries} color="purple" />
                <StatCard
                  icon={TrendingUp}
                  label="Overall Avg GPA"
                  value={data.summary.overallAvgGPA.toFixed(2)}
                  sub={
                    data.summary.overallAvgGPA >= 3.7 ? 'First Class'
                    : data.summary.overallAvgGPA >= 3.3 ? 'Second Class (Upper Division)'
                    : data.summary.overallAvgGPA >= 2.7 ? 'Second Class (Lower Division)'
                    : data.summary.overallAvgGPA >= 2.0 ? 'Pass'
                    : 'Pass'
                  }
                  color="green"
                />
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Grade Distribution Bar Chart */}
                <div className="bg-surface rounded-3xl border border-border shadow-sm p-6">
                  <h3 className="text-textDark font-bold text-base mb-4">Grade Distribution</h3>
                  {data.gradeDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={data.gradeDistribution} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="grade" stroke="#6B7280" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#6B7280" tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: 12 }}
                          formatter={(value) => [value, 'Count']}
                        />
                        <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]}>
                          {data.gradeDistribution.map((entry, idx) => (
                            <Cell key={idx} fill={GRADE_PIE_COLORS[idx % GRADE_PIE_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <EmptyState message="No grade data available for selected filters." />}
                </div>

                {/* Department Comparison */}
                <div className="bg-surface rounded-3xl border border-border shadow-sm p-6">
                  <h3 className="text-textDark font-bold text-base mb-4">Department Avg GPA</h3>
                  {data.departmentComparison.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={data.departmentComparison} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                          dataKey="department"
                          stroke="#6B7280"
                          tick={{ fontSize: 10 }}
                          tickFormatter={(val) => val === 'Software Engineering' ? 'SE' : val === 'Computer Information Systems' ? 'CIS' : 'DS'}
                        />
                        <YAxis stroke="#6B7280" domain={[0, 4]} tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: 12 }}
                          formatter={(value) => [value.toFixed(2), 'Avg GPA']}
                        />
                        <Bar dataKey="avgGPA" radius={[8, 8, 0, 0]}>
                          {data.departmentComparison.map((entry) => (
                            <Cell key={entry.department} fill={DEPT_COLORS_CHART[entry.department] || '#6B7280'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <EmptyState message="No department data for selected filters." />}
                </div>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Semester Trend Line Chart */}
                <div className="xl:col-span-2 bg-surface rounded-3xl border border-border shadow-sm p-6">
                  <h3 className="text-textDark font-bold text-base mb-4">GPA Trend by Semester</h3>
                  {data.semesterTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={data.semesterTrend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                          dataKey="semester"
                          stroke="#6B7280"
                          tick={{ fontSize: 10 }}
                          tickFormatter={(val) => val.replace('Semester ', 'S')}
                        />
                        <YAxis stroke="#6B7280" domain={[0, 4]} tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: 12 }}
                          formatter={(value, name) => [value.toFixed(2), name]}
                        />
                        <Legend />
                        {Object.keys(DEPT_COLORS_CHART).map((dept) => {
                          const hasDept = data.semesterTrend.some((d) => d.department === dept);
                          if (!hasDept) return null;
                          return (
                            <Line
                              key={dept}
                              type="monotone"
                              dataKey="avgGPA"
                              name={dept === 'Software Engineering' ? 'SE' : dept === 'Computer Information Systems' ? 'CIS' : 'DS'}
                              stroke={DEPT_COLORS_CHART[dept]}
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              data={data.semesterTrend.filter((d) => d.department === dept)}
                            />
                          );
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  ) : <EmptyState message="Not enough semester data yet." />}
                </div>

                {/* Top 10 Performers */}
                <div className="bg-surface rounded-3xl border border-border shadow-sm p-6 overflow-hidden">
                  <h3 className="text-textDark font-bold text-base mb-4 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-secondary-500" />
                    Top Performers
                  </h3>
                  {data.topPerformers.length > 0 ? (
                    <div className="space-y-2 overflow-y-auto max-h-[260px] pr-1">
                      {data.topPerformers.map((student, i) => (
                        <div
                          key={student._id}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-primary/5 ${i === 0 ? 'bg-amber-50 border border-amber-100' : ''}`}
                        >
                          <div className="flex items-center justify-center w-6 shrink-0">
                            <RankIcon rank={i + 1} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-textDark truncate">{student.name}</p>
                            <p className="text-xs text-textMuted truncate">{student.rollNumber}</p>
                          </div>
                          <GpaTag gpa={student.avgGPA} />
                        </div>
                      ))}
                    </div>
                  ) : <EmptyState message="No student performance data yet." />}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* No data at all */}
      {!loading && !error && data && data.summary.totalPublished === 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl p-6 text-sm font-medium text-center">
          No published results found for the selected filters. Publish some results first to see GPA analytics.
        </div>
      )}
    </div>
  );
}
