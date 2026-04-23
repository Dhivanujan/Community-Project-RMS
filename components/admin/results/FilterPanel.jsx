"use client";

import { ChevronDown } from 'lucide-react';

export default function FilterPanel({
    config,
    filters,
    onFilterChange,
    onFetchStudents,
    isLoadingStudents,
    disabled,
}) 