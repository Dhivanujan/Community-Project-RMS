"use client";

const STATUS_STYLES = {
    draft: 'bg-secondary-500/10 text-amber-700 border border-amber-500/20',
    published: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
};

export default function StatusBadge({ status }) {
    const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : '';
    const styles = STATUS_STYLES[normalizedStatus] || 'bg-slate-500/10 text-slate-700 border border-slate-500/20';

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${styles}`}>
            {normalizedStatus || 'unknown'}
        </span>
    );
}