"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function PublishConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    isPublishing,
    uploadData,
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen) return null;
    if (!mounted) return null;

    const { subjectCode, subjectName, semester, department, studentCount, gradeDistribution } = uploadData;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-surface dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="flex items-center gap-3 p-6 border-b border-border dark:border-slate-800 bg-amber-50/50 dark:bg-amber-950/20">
                    <div className="w-10 h-10 rounded-xl bg-secondary-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-textDark dark:text-white">Confirm Publish</h3>
                        <p className="text-xs text-textMuted dark:text-slate-400 font-medium mt-0.5">This action will make results visible to students</p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Summary Card */}
                    <div className="bg-background dark:bg-slate-950 rounded-2xl p-4 border border-border dark:border-slate-800 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs text-textMuted dark:text-slate-500 font-bold uppercase tracking-wider">Subject</p>
                                <p className="text-sm font-bold text-textDark dark:text-slate-200 mt-0.5">{subjectCode} — {subjectName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-textMuted dark:text-slate-500 font-bold uppercase tracking-wider">Semester</p>
                                <p className="text-sm font-bold text-textDark dark:text-slate-200 mt-0.5">{semester}</p>
                            </div>
                            <div>
                                <p className="text-xs text-textMuted dark:text-slate-500 font-bold uppercase tracking-wider">Department</p>
                                <p className="text-sm font-bold text-textDark dark:text-slate-200 mt-0.5">{department}</p>
                            </div>
                            <div>
                                <p className="text-xs text-textMuted dark:text-slate-500 font-bold uppercase tracking-wider">Students</p>
                                <p className="text-sm font-bold text-textDark dark:text-slate-200 mt-0.5">{studentCount}</p>
                            </div>
                        </div>

                        {/* Grade Distribution */}
                        {gradeDistribution && Object.keys(gradeDistribution).length > 0 && (
                            <div className="pt-3 border-t border-border dark:border-slate-800">
                                <p className="text-xs text-textMuted dark:text-slate-500 font-bold uppercase tracking-wider mb-2">Grade Distribution</p>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(gradeDistribution).map(([grade, count]) => (
                                        <span
                                            key={grade}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/5 dark:bg-blue-950/40 text-primary dark:text-blue-400 text-xs font-bold rounded-lg"
                                        >
                                            {grade}: {count}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Warning */}
                    <div className="p-3 bg-secondary-500/10 dark:bg-amber-950/20 text-amber-700 dark:text-amber-450 text-sm font-medium rounded-xl border border-amber-500/20 dark:border-amber-900/30">
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
                <div className="p-6 border-t border-border dark:border-slate-800 flex justify-end gap-3 bg-white dark:bg-slate-900">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPublishing}
                        className="px-5 py-2.5 text-sm font-semibold text-textMuted hover:text-textDark dark:text-slate-400 dark:hover:text-white bg-background dark:bg-slate-950 border border-border dark:border-slate-800 hover:bg-border dark:hover:bg-slate-800 rounded-xl transition-all disabled:opacity-50"
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
        </div>,
        document.body
    );
}
