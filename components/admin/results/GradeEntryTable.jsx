"use client";

import { GraduationCap, AlertCircle, ChevronDown } from 'lucide-react';

const VALID_GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'E', 'F'];

export default function GradeEntryTable({
    students,
    grades,
    onGradeChange,
    onBatchGrade,
    validationErrors,
    disabled,
    isPublished,
}) {
    const gradeDistribution = {};
    Object.values(grades).forEach((g) => {
        if (g) gradeDistribution[g] = (gradeDistribution[g] || 0) + 1;
    });

    const totalAssigned = Object.values(grades).filter(Boolean).length;
    const totalStudents = students.length;
    const allAssigned = totalAssigned === totalStudents && totalStudents > 0;

    return (
        <div className="bg-surface rounded-3xl shadow-sm border border-border overflow-hidden">
            {/* Table Header Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-border">
                <div>
                    <h3 className="text-lg font-bold text-textDark tracking-tight">
                        Grade Entry
                    </h3>
                    <p className="text-xs text-textMuted font-medium mt-1">
                        {totalAssigned} of {totalStudents} grades assigned
                        {allAssigned && (
                            <span className="ml-2 text-emerald-600">— All complete ✓</span>
                        )}
                    </p>
                </div>

                {/* Batch grade setter */}
                {!disabled && totalStudents > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-textMuted uppercase tracking-wider whitespace-nowrap">
                            Set all to:
                        </span>
                        <div className="relative">
                            <select
                                onChange={(e) => {
                                    if (e.target.value) {
                                        onBatchGrade(e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                                defaultValue=""
                                className="appearance-none bg-background border border-border rounded-xl px-4 py-2 text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-textDark pr-8"
                            >
                                <option value="" disabled>Grade</option>
                                {VALID_GRADES.map((g) => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-textMuted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                )}
            </div>

            {/* Grade Distribution Summary */}
            {totalAssigned > 0 && (
                <div className="px-6 py-3 bg-black/[0.015] border-b border-border flex flex-wrap gap-2">
                    {Object.entries(gradeDistribution)
                        .sort(([a], [b]) => VALID_GRADES.indexOf(a) - VALID_GRADES.indexOf(b))
                        .map(([grade, count]) => (
                            <span
                                key={grade}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/5 text-primary text-xs font-bold rounded-lg"
                            >
                                {grade}: {count}
                            </span>
                        ))}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border text-textMuted text-xs uppercase tracking-wider">
                            <th className="py-4 font-semibold px-6 w-12">#</th>
                            <th className="py-4 font-semibold px-4">Student</th>
                            <th className="py-4 font-semibold px-4">Roll Number</th>
                            <th className="py-4 font-semibold px-4 w-48">Grade</th>
                            <th className="py-4 font-semibold px-4 w-24 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map((student, index) => {
                                const studentId = student._id;
                                const currentGrade = grades[studentId] || '';
                                const hasError = validationErrors[studentId];

                                return (
                                    <tr
                                        key={studentId}
                                        className="border-b border-border/50 hover:bg-black/[0.02] transition-colors group"
                                    >
                                        <td className="py-4 px-6 text-textMuted text-sm font-medium">
                                            {index + 1}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shadow-sm">
                                                    {student.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-textDark text-sm group-hover:text-primary transition-colors">
                                                        {student.name}
                                                    </p>
                                                    <p className="text-textMuted text-xs">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm font-semibold text-textDark">
                                                {student.rollNumber}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="relative">
                                                <select
                                                    disabled={disabled}
                                                    value={currentGrade}
                                                    onChange={(e) => onGradeChange(studentId, e.target.value)}
                                                    className={`w-full appearance-none bg-background border rounded-xl px-4 py-2.5 text-sm font-semibold outline-none transition-all pr-8 disabled:opacity-60 disabled:cursor-not-allowed ${
                                                        hasError
                                                            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-red-600'
                                                            : currentGrade
                                                                ? 'border-emerald-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-textDark'
                                                                : 'border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-textDark'
                                                    }`}
                                                >
                                                    <option value="">Select Grade</option>
                                                    {VALID_GRADES.map((g) => (
                                                        <option key={g} value={g}>{g}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="w-3.5 h-3.5 text-textMuted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                            {hasError && (
                                                <p className="flex items-center gap-1 text-red-500 text-xs font-medium mt-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    Grade is required
                                                </p>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {currentGrade ? (
                                                <span className="inline-flex w-6 h-6 items-center justify-center bg-emerald-500/10 text-emerald-600 rounded-full">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex w-6 h-6 items-center justify-center bg-secondary-500/10 text-secondary-500 rounded-full">
                                                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-16 text-center text-textMuted text-sm font-medium">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <GraduationCap className="w-12 h-12 text-border" />
                                        <p>No students loaded yet.</p>
                                        <p className="text-xs">Select Department & Batch, then click &quot;Load Students&quot;</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
