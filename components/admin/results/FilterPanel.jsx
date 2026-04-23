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
