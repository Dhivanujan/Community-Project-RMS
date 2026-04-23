"use client";

import { ChevronDown } from 'lucide-react';

export default function FilterPanel({
    config,
    filters,
    onFilterChange,
    onFetchStudents,
    isLoadingStudents,
    disabled,
}) {
    const { academicYears = [], departments = [], batches = [], semesters = [], subjects = {} } = config;

    // Get subjects filtered by selected department + semester
    const departmentSubjects = subjects[filters.department] || [];
    const filteredSubjects = filters.semester
        ? departmentSubjects.filter((s) => s.semester === filters.semester)
        : departmentSubjects;

    const selectedSubject = filteredSubjects.find((s) => s.code === filters.subjectCode);

    const allFiltersSelected =
        filters.academicYear &&
        filters.department &&
        filters.batch &&
        filters.semester &&
        filters.subjectCode;

    const canFetchStudents = filters.department && filters.batch;

    const handleSubjectChange = (code) => {
        const subject = filteredSubjects.find((s) => s.code === code);
        onFilterChange('subjectCode', code);
        if (subject) {
            onFilterChange('subjectName', subject.name);
            onFilterChange('credits', subject.credits);
        }
    };

    return (
        <div className="bg-surface rounded-3xl shadow-sm border border-border p-6 space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-textDark tracking-tight">Select Filters</h3>
                {allFiltersSelected && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                        All filters selected ✓
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Academic Year */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-textMuted uppercase tracking-wider">
                        Academic Year
                    </label>
                    <div className="relative">
                        <select
                            disabled={disabled}
                            value={filters.academicYear}
                            onChange={(e) => onFilterChange('academicYear', e.target.value)}
                            className="w-full appearance-none bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-textDark disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Select Year</option>
                            {academicYears.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-textMuted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-textMuted uppercase tracking-wider">
                        Department
                    </label>
                    <div className="relative">
                        <select
                            disabled={disabled}
                            value={filters.department}
                            onChange={(e) => onFilterChange('department', e.target.value)}
                            className="w-full appearance-none bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-textDark disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept.value} value={dept.value}>{dept.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-textMuted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
