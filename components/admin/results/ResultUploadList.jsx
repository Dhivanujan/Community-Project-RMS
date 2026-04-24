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

        const matchesStatus =
            statusFilter === 'all' || upload.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="bg-surface rounded-3xl shadow-sm border border-border overflow-hidden">
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-border">
                <div className="relative flex-1 w-full sm:max-w-md">
                    <Search className="w-4 h-4 text-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by subject code, name, or department..."
                        className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-textDark placeholder:text-textMuted"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    {['all', 'draft', 'published'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all capitalize ${
                                statusFilter === s
                                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                                    : 'bg-background text-textMuted border border-border hover:bg-border hover:text-textDark'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
