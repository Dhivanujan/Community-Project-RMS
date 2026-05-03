"use client";

import { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, ChevronDown, Hash, Award } from 'lucide-react';
import { SUBJECTS, DEPARTMENTS, SEMESTERS } from '@/lib/resultUpload/config';

const DEPT_COLORS = {
  'Software Engineering': {
    badge: 'bg-blue-500/10 text-blue-600 border-blue-100',
    code: 'bg-blue-500 text-white',
  },
  'Computer Information Systems': {
    badge: 'bg-violet-500/10 text-violet-600 border-violet-100',
    code: 'bg-violet-500 text-white',
  },
  'Data Science': {
    badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-100',
    code: 'bg-emerald-500 text-white',
  },
};

const CREDIT_COLORS = {
  3: 'bg-blue-50 text-blue-600',
  4: 'bg-amber-50 text-amber-600',
  6: 'bg-rose-50 text-rose-600',
};

function getGradeYear(semester) {
  const num = parseInt(semester.replace('Semester ', ''));
  if (num <= 2) return 'Year 1';
  if (num <= 4) return 'Year 2';
  if (num <= 6) return 'Year 3';
  return 'Year 4';
}

export default function SubjectsManager() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [semFilter, setSemFilter] = useState('');

  // Flatten all subjects with department tag
  const allSubjects = useMemo(() => {
    const flat = [];
    Object.entries(SUBJECTS).forEach(([dept, subjects]) => {
      subjects.forEach((s) => flat.push({ ...s, department: dept }));
    });
    return flat;
  }, []);

  const filtered = useMemo(() => {
    return allSubjects.filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase());
      const matchDept = !deptFilter || s.department === deptFilter;
      const matchSem = !semFilter || s.semester === semFilter;
      return matchSearch && matchDept && matchSem;
    });
  }, [allSubjects, search, deptFilter, semFilter]);

  // Stats per department
  const deptStats = useMemo(() => {
    const stats = {};
    DEPARTMENTS.forEach(({ value }) => {
      stats[value] = {
        count: allSubjects.filter((s) => s.department === value).length,
        credits: allSubjects.filter((s) => s.department === value).reduce((a, s) => a + s.credits, 0),
      };
    });
    return stats;
  }, [allSubjects]);

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {DEPARTMENTS.map(({ value, label }) => {
          const colors = DEPT_COLORS[value] || {};
          const stats = deptStats[value] || {};
          return (
            <div key={value} className="bg-surface rounded-2xl border border-border p-5 shadow-sm hover-lift cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${colors.badge}`}>
                  {value === 'Software Engineering' ? 'SE' : value === 'Computer Information Systems' ? 'CIS' : 'DS'}
                </span>
                <BookOpen className="w-4 h-4 text-textMuted" />
              </div>
              <p className="text-2xl font-bold text-textDark">{stats.count}</p>
              <p className="text-xs text-textMuted font-medium mt-0.5">
                subjects · {stats.credits} credits total
              </p>
              <p className="text-xs text-textMuted mt-2 truncate">{label}</p>
            </div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="bg-surface/80 glass-card rounded-2xl border border-border shadow-sm p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
          <input
            type="text"
            placeholder="Search by subject name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 text-textDark placeholder:text-textMuted transition-all"
          />
        </div>

        {/* Department Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-background border border-border rounded-xl text-sm text-textDark outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 appearance-none transition-all cursor-pointer"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-textMuted pointer-events-none" />
        </div>

        {/* Semester Filter */}
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted pointer-events-none" />
          <select
            value={semFilter}
            onChange={(e) => setSemFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-background border border-border rounded-xl text-sm text-textDark outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 appearance-none transition-all cursor-pointer"
          >
            <option value="">All Semesters</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-textMuted pointer-events-none" />
        </div>

        <span className="text-xs text-textMuted font-semibold whitespace-nowrap">
          {filtered.length} / {allSubjects.length}
        </span>
      </div>

      {/* Subjects Table */}
      <div className="bg-surface/80 glass-card rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-background/60">
                <th className="px-5 py-3.5 text-xs font-bold text-textMuted uppercase tracking-wider">Code</th>
                <th className="px-5 py-3.5 text-xs font-bold text-textMuted uppercase tracking-wider">Subject</th>
                <th className="px-5 py-3.5 text-xs font-bold text-textMuted uppercase tracking-wider">Department</th>
                <th className="px-5 py-3.5 text-xs font-bold text-textMuted uppercase tracking-wider">Year</th>
                <th className="px-5 py-3.5 text-xs font-bold text-textMuted uppercase tracking-wider">Semester</th>
                <th className="px-5 py-3.5 text-xs font-bold text-textMuted uppercase tracking-wider text-center">Credits</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((subject, i) => {
                  const colors = DEPT_COLORS[subject.department] || {};
                  const creditColor = CREDIT_COLORS[subject.credits] || 'bg-gray-100 text-gray-600';
                  const year = getGradeYear(subject.semester);
                  return (
                    <tr
                      key={`${subject.code}-${i}`}
                      className="border-b border-border/50 hover:bg-primary/5 transition-colors group"
                    >
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black tracking-wider ${colors.code}`}>
                          {subject.code}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-textDark text-sm group-hover:text-primary transition-colors">
                          {subject.name}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colors.badge}`}>
                          {subject.department === 'Software Engineering' ? 'SE'
                            : subject.department === 'Computer Information Systems' ? 'CIS'
                            : 'DS'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-textMuted font-medium">{year}</td>
                      <td className="px-5 py-4 text-sm text-textMuted font-medium">{subject.semester}</td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold ${creditColor}`}>
                          {subject.credits}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-textMuted text-sm">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-primary/5 rounded-full">
                        <BookOpen className="w-10 h-10 text-primary/40" />
                      </div>
                      <p className="font-medium">No subjects match your filters.</p>
                      <button
                        onClick={() => { setSearch(''); setDeptFilter(''); setSemFilter(''); }}
                        className="text-primary text-xs font-semibold hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-textMuted font-medium">
        <div className="flex items-center gap-2">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>6 credits = Research Project</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-100" />
          <span>4 credit subjects</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-100" />
          <span>3 credit subjects</span>
        </div>
      </div>
    </div>
  );
}
