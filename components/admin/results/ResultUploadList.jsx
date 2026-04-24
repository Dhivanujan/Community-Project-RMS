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

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border text-textMuted text-xs uppercase tracking-wider">
                            <th className="py-4 font-semibold px-6">Subject</th>
                            <th className="py-4 font-semibold px-4">Department</th>
                            <th className="py-4 font-semibold px-4">Semester</th>
                            <th className="py-4 font-semibold px-4">Batch</th>
                            <th className="py-4 font-semibold px-4">Status</th>
                            <th className="py-4 font-semibold px-4">Date</th>
                            <th className="py-4 font-semibold px-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUploads.length > 0 ? (
                            filteredUploads.map((upload) => (
                                <tr
                                    key={upload._id}
                                    className="border-b border-border/50 hover:bg-black/[0.02] transition-colors group"
                                >
                                    <td className="py-4 px-6">
                                        <div>
                                            <p className="font-bold text-textDark text-sm group-hover:text-primary transition-colors">
                                                {upload.subjectCode}
                                            </p>
                                            <p className="text-textMuted text-xs font-medium">
                                                {upload.subjectName}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="w-fit px-3 py-1 bg-blue-500/10 text-blue-600 text-xs font-bold rounded-md">
                                            {upload.department}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-textDark font-medium">
                                        {upload.semester}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-textMuted font-medium">
                                        {upload.batch}
                                    </td>
                                    <td className="py-4 px-4">
                                        <StatusBadge status={upload.status} />
                                    </td>
                                    <td className="py-4 px-4 text-textMuted text-xs font-medium">
                                        {upload.status === 'published' && upload.publishedAt
                                            ? new Date(upload.publishedAt).toLocaleDateString('en-US', {
                                                  year: 'numeric',
                                                  month: 'short',
                                                  day: 'numeric',
                                              })
                                            : new Date(upload.updatedAt).toLocaleDateString('en-US', {
                                                  year: 'numeric',
                                                  month: 'short',
                                                  day: 'numeric',
                                              })}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onView(upload._id)}
                                                className="p-2 text-textMuted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onEdit(upload._id)}
                                                className="p-2 text-textMuted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title={upload.status === 'published' ? 'Edit (Audit Logged)' : 'Edit Draft'}
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            {upload.status === 'draft' && (
                                                <button
                                                    onClick={() => onDelete(upload._id)}
                                                    disabled={isDeleting}
                                                    className="p-2 text-textMuted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete Draft"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="py-16 text-center text-textMuted text-sm font-medium">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <FileText className="w-12 h-12 text-border" />
                                        <p>No result uploads found.</p>
                                        <p className="text-xs">Click &quot;New Upload&quot; to create one.</p>
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
