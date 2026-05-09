"use client";

import { useState, useEffect } from 'react';
import { X, Loader2, User, Mail, ShieldCheck } from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose, onSuccess, initialData }) {
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialData && isOpen) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            if (data.data && data.data.name) {
                localStorage.setItem('userName', data.data.name);
            }

            onSuccess(data.data);
            onClose();
            
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate initials for the preview avatar
    const getInitials = (name) => {
        if (!name) return 'AD';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Glassmorphism Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fadeIn" 
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-fadeInUp">
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary-900 to-primary-700 opacity-10"></div>
                
                <div className="relative px-8 pt-8 pb-6 flex flex-col items-center text-center">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full p-2 transition-all active:scale-95"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Avatar Preview */}
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-900 to-primary-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-900/20 mb-4 ring-4 ring-white">
                        {getInitials(formData.name)}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-2">
                        Admin Profile
                        <ShieldCheck className="w-5 h-5 text-primary-600" />
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Update your personal information below.</p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
                    {error && (
                        <div className="p-3.5 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-start gap-2">
                            <span className="shrink-0 mt-0.5">⚠️</span>
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <User className="w-4.5 h-4.5" />
                            </div>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary-900/50 focus:ring-4 focus:ring-primary-900/10 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                                placeholder="e.g. Dr. Sterling"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Mail className="w-4.5 h-4.5" />
                            </div>
                            <input 
                                required
                                type="email" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary-900/50 focus:ring-4 focus:ring-primary-900/10 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                                placeholder="admin@university.edu"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-4 mt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-5 py-3 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-all shadow-lg shadow-primary-900/25 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
