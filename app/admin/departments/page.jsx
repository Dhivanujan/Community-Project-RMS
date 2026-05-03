import { Building2, User, GraduationCap, ChevronRight, Award } from 'lucide-react';
import { FACULTY_INFO, SUBJECTS } from '@/lib/resultUpload/config';

const colorMap = {
  'Software Engineering': {
    badge: 'bg-blue-500/10 text-blue-600 border-blue-200',
    icon: 'bg-blue-500/10 text-blue-600',
    accent: 'border-l-blue-500',
    dot: 'bg-blue-500',
    yearBg: 'bg-blue-50 border-blue-100',
    yearText: 'text-blue-700',
  },
  'Computer Information Systems': {
    badge: 'bg-violet-500/10 text-violet-600 border-violet-200',
    icon: 'bg-violet-500/10 text-violet-600',
    accent: 'border-l-violet-500',
    dot: 'bg-violet-500',
    yearBg: 'bg-violet-50 border-violet-100',
    yearText: 'text-violet-700',
  },
  'Data Science': {
    badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    icon: 'bg-emerald-500/10 text-emerald-600',
    accent: 'border-l-emerald-500',
    dot: 'bg-emerald-500',
    yearBg: 'bg-emerald-50 border-emerald-100',
    yearText: 'text-emerald-700',
  },
};

export default function DepartmentsPage() {
  const departments = FACULTY_INFO.departments;
  const deptNames = Object.keys(departments);

  return (
    <div className="w-full space-y-8 animate-fadeInUp">
      {/* Page Header */}
      <header>
        <h1 className="text-3xl lg:text-4xl font-bold text-textDark tracking-tight leading-[1.15] flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl card-glow">
            <Building2 className="w-8 h-8 text-primary animate-pulse-glow" />
          </div>
          Departments
        </h1>
        <p className="mt-3 text-textMuted text-sm font-medium">
          Faculty of Computing — Sabaragamuwa University of Sri Lanka (SUSL)
        </p>
      </header>

      {/* Dean Banner */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-3xl p-6 shadow-lg shadow-primary/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
            <Award className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Dean of Faculty</p>
            <p className="text-white text-xl font-bold mt-0.5">{FACULTY_INFO.dean}</p>
            <p className="text-white/60 text-sm mt-0.5">Faculty of Computing, SUSL</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-white/80">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{deptNames.length}</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-0.5">Departments</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">4</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-0.5">Years</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <p className="text-2xl font-bold text-white">8</p>
            <p className="text-xs font-semibold uppercase tracking-wider mt-0.5">Semesters</p>
          </div>
        </div>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {deptNames.map((deptName) => {
          const dept = departments[deptName];
          const colors = colorMap[deptName];
          const deptSubjects = SUBJECTS[deptName] || [];
          const totalCredits = deptSubjects.reduce((sum, s) => sum + s.credits, 0);

          return (
            <div
              key={deptName}
              className={`bg-surface rounded-3xl border border-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border-l-4 ${colors.accent} flex flex-col`}
            >
              {/* Card Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${colors.icon}`}>
                    {dept.code}
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${colors.badge}`}>
                    {dept.code}
                  </span>
                </div>
                <h2 className="mt-4 text-lg font-bold text-textDark leading-tight">{deptName}</h2>

                {/* Head of Department */}
                <div className="mt-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-textMuted shrink-0" />
                  <div>
                    <p className="text-[10px] text-textMuted uppercase tracking-widest font-bold">Head of Department</p>
                    <p className="text-sm font-semibold text-textDark">{dept.head}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 flex items-center gap-4">
                  <div>
                    <p className="text-xl font-bold text-textDark">{deptSubjects.length}</p>
                    <p className="text-xs text-textMuted font-medium">Subjects</p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div>
                    <p className="text-xl font-bold text-textDark">{totalCredits}</p>
                    <p className="text-xs text-textMuted font-medium">Total Credits</p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div>
                    <p className="text-xl font-bold text-textDark">4</p>
                    <p className="text-xs text-textMuted font-medium">Years</p>
                  </div>
                </div>
              </div>

              {/* Year-by-Year Curriculum Focus */}
              <div className="p-6 flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-textMuted mb-3">
                  Curriculum by Year
                </p>
                <div className="space-y-2">
                  {Object.entries(dept.yearFocus).map(([year, focus]) => (
                    <div
                      key={year}
                      className={`flex items-start gap-3 p-3 rounded-xl border ${colors.yearBg} transition-all duration-200 hover:shadow-sm`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${colors.dot}`} />
                      <div>
                        <p className={`text-xs font-bold ${colors.yearText}`}>{year}</p>
                        <p className="text-xs text-textMuted mt-0.5 leading-relaxed">{focus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6">
                <a
                  href="/admin/subjects"
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${colors.badge} hover:opacity-80`}
                >
                  <GraduationCap className="w-4 h-4" />
                  View All Subjects
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Degree Classification Reference */}
      <div className="bg-surface rounded-3xl border border-border shadow-sm p-6">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-textMuted mb-4">
          Degree Classification Reference
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'First Class', range: 'FGPA ≥ 3.70', color: 'bg-amber-500/10 text-amber-700 border-amber-200' },
            { label: 'Second Class (Upper)', range: '3.30 – 3.69', color: 'bg-blue-500/10 text-blue-700 border-blue-200' },
            { label: 'Second Class (Lower)', range: '2.70 – 3.29', color: 'bg-violet-500/10 text-violet-700 border-violet-200' },
            { label: 'Pass', range: '2.00 – 2.69', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200' },
          ].map((cls) => (
            <div key={cls.label} className={`rounded-2xl border p-4 ${cls.color}`}>
              <p className="font-bold text-sm">{cls.label}</p>
              <p className="text-xs mt-1 opacity-80">{cls.range}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-textMuted font-medium">
          FGPA = 0.2 × Year 1 + 0.2 × Year 2 + 0.3 × Year 3 + 0.3 × Year 4
        </p>
      </div>
    </div>
  );
}
