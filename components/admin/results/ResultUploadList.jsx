"use client";

import { Eye, Edit3, Trash2, FileText, Search } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useState } from 'react';

export default function ResultUploadList({
    uploads,
    onView,
    onEdit,
    onDelete,
    isDeleting,
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredUploads = uploads.filter((upload) => {
        const matchesSearch =
            searchQuery === '' ||
            upload.subjectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            upload.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            upload.department.toLowerCase().includes(searchQuery.toLowerCase());
