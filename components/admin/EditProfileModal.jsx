"use client";

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

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

            // Update local storage with the new name
            if (data.data && data.data.name) {
                localStorage.setItem('userName', data.data.name);
            }

            onSuccess(data.data); // Pass back updated admin data
            onClose();
            
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-surface rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp">
                <div className="flex items-center justify-between p-6 border-b border-border bg-black/[0.02]">
                    <h3 className="text-xl font-bold text-textDark">Edit Profile</h3>
                    <button 
                        onClick={onClose}
                        className="text-textMuted hover:text-textDark bg-background hover:bg-border rounded-full p-2 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 text-red-600 text-sm font-medium rounded-xl border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Full Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary-900/50 focus:ring-2 focus:ring-primary-900/20 outline-none transition-all"
                            placeholder="e.g. Dr. Sterling"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Email Address</label>
                        <input 
                            required
                            type="email" 
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary-900/50 focus:ring-2 focus:ring-primary-900/20 outline-none transition-all"
                            placeholder="admin@university.edu"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="pt-4 border-t border-border mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-textMuted hover:text-textDark bg-background border border-border hover:bg-border rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary-900 hover:bg-primary-800 hover-lift rounded-xl transition-all shadow-md shadow-primary-900/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
