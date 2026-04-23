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