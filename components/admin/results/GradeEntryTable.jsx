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