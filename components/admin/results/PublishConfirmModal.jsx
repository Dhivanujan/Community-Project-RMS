"use client";

import { AlertTriangle, Loader2 } from 'lucide-react';

export default function PublishConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    isPublishing,
    uploadData,
}) {
    if (!isOpen) return null;

    const { subjectCode, subjectName, semester, department, studentCount, gradeDistribution } = uploadData;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-surface rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp">
                {/* Header */}
                <div className="flex items-center gap-3 p-6 border-b border-border bg-amber-50/50">
                    <div className="w-10 h-10 rounded-xl bg-secondary-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-textDark">Confirm Publish</h3>
                        <p className="text-xs text-textMuted font-medium mt-0.5">This action will make results visible to students</p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Summary Card */}
                    <div className="bg-background rounded-2xl p-4 border border-border space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs text-textMuted font-bold uppercase tracking-wider">Subject</p>
                                <p className="text-sm font-bold text-textDark mt-0.5">{subjectCode} — {subjectName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-textMuted font-bold uppercase tracking-wider">Semester</p>
                                <p className="text-sm font-bold text-textDark mt-0.5">{semester}</p>
                            </div>
                            <div>
                                <p className="text-xs text-textMuted font-bold uppercase tracking-wider">Department</p>
                                <p className="text-sm font-bold text-textDark mt-0.5">{department}</p>
                            </div>
                            <div>
                                <p className="text-xs text-textMuted font-bold uppercase tracking-wider">Students</p>
                                <p className="text-sm font-bold text-textDark mt-0.5">{studentCount}</p>
                            </div>
                        </div>

                        {/* Grade Distribution */}
                        {gradeDistribution && Object.keys(gradeDistribution).length > 0 && (
                            <div className="pt-3 border-t border-border">
                                <p className="text-xs text-textMuted font-bold uppercase tracking-wider mb-2">Grade Distribution</p>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(gradeDistribution).map(([grade, count]) => (
                                        <span
                                            key={grade}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/5 text-primary text-xs font-bold rounded-lg"
                                        >
                                            {grade}: {count}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Warning */}
                    <div className="p-3 bg-secondary-500/10 text-amber-700 text-sm font-medium rounded-xl border border-amber-500/20">
                        <p className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>
                                Once published, results will be immediately visible to students and notifications will be sent.
                                Grades can still be edited after publishing, but all changes will be tracked in the audit log.
                            </span>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPublishing}
                        className="px-5 py-2.5 text-sm font-semibold text-textMuted hover:text-textDark bg-background border border-border hover:bg-border rounded-xl transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isPublishing}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isPublishing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            'Publish Results'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
