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
