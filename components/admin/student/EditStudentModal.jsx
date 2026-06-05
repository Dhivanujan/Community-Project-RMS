"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';

export default function EditStudentModal({ isOpen, onClose, onSuccess, initialData }) {
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        email: '',
        department: '',
        enrollmentYear: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (initialData && isOpen) {
            setFormData({
                name: initialData.name || '',
                rollNumber: initialData.rollNumber || '',
                email: initialData.email || '',
                department: initialData.department || '',
                enrollmentYear: initialData.enrollmentYear || ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;
    if (!mounted) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/students/${initialData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                 ...formData,
                 enrollmentYear: formData.enrollmentYear
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            onSuccess(data); // Pass back the updated student record
            onClose();
            
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-surface dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between p-6 border-b border-border dark:border-slate-800 bg-black/[0.02] dark:bg-slate-800/10">
                    <h3 className="text-xl font-bold text-textDark dark:text-white">Edit Student</h3>
                    <button 
                        onClick={onClose}
                        className="text-textMuted hover:text-textDark dark:text-slate-400 dark:hover:text-white bg-background dark:bg-slate-850 hover:bg-border dark:hover:bg-slate-800 rounded-full p-2 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl border border-red-500/20 dark:border-red-900/30">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-textMuted dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-background dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-primary-900/50 focus:ring-2 focus:ring-primary-900/20 dark:text-white outline-none transition-all"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-textMuted dark:text-slate-400 uppercase tracking-wider">Roll Number</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-background dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-primary-900/50 focus:ring-2 focus:ring-primary-900/20 dark:text-white outline-none transition-all"
                                placeholder="IT20123456"
                                value={formData.rollNumber}
                                onChange={e => setFormData({...formData, rollNumber: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-textMuted dark:text-slate-400 uppercase tracking-wider">Email</label>
                            <input 
                                required
                                type="email" 
                                className="w-full bg-background dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-primary-900/50 focus:ring-2 focus:ring-primary-900/20 dark:text-white outline-none transition-all"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-textMuted dark:text-slate-400 uppercase tracking-wider">Department</label>
                            <select 
                                required
                                className="w-full bg-background dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-primary-900/50 focus:ring-2 focus:ring-primary-900/20 dark:text-white outline-none transition-all"
                                value={formData.department}
                                onChange={e => setFormData({...formData, department: e.target.value})}
                            >
                                <option value="" disabled className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">Select Dept</option>
                                <option value="Software Engineering" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">Software Engineering (SE)</option>
                                <option value="Computer Information Systems" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">Computer Information Systems (CIS)</option>
                                <option value="Data Science" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">Data Science (DS)</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-textMuted dark:text-slate-400 uppercase tracking-wider">Enrollment Year</label>
                            <input 
                                required
                                type="text" 
                                placeholder="21/22"
                                className="w-full bg-background dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-primary-900/50 focus:ring-2 focus:ring-primary-900/20 dark:text-white outline-none transition-all"
                                value={formData.enrollmentYear}
                                onChange={e => setFormData({...formData, enrollmentYear: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border dark:border-slate-800 mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-textMuted hover:text-textDark dark:text-slate-400 dark:hover:text-white bg-background dark:bg-slate-950 border border-border dark:border-slate-800 rounded-xl transition-all hover:bg-border dark:hover:bg-slate-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-900 hover:bg-primary-800 dark:bg-blue-600 dark:hover:bg-blue-700 hover-lift rounded-xl transition-all shadow-md shadow-primary-900/30 dark:shadow-none disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
