"use client";

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function AddStudentModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        email: '',
        department: '',
        enrollmentYear: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/students', {
                method: 'POST',
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

            // Successfully added
            setFormData({
                name: '',
                rollNumber: '',
                email: '',
                department: '',
                enrollmentYear: ''
            });
            onSuccess(data); // Pass back the new student record
            
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
            <div className="relative w-full max-w-lg bg-surface rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp">
                <div className="flex items-center justify-between p-6 border-b border-border bg-black/[0.02]">
                    <h3 className="text-xl font-bold text-textDark">Add New Student</h3>
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
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Roll Number</label>
                            <input 
                                required
                                type="text" 
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="IT20123456"
                                value={formData.rollNumber}
                                onChange={e => setFormData({...formData, rollNumber: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Email</label>
                            <input 
                                required
                                type="email" 
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Department</label>
                            <select 
                                required
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                value={formData.department}
                                onChange={e => setFormData({...formData, department: e.target.value})}
                            >
                                <option value="" disabled>Select Dept</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Software Engineering">Software Engineering</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="Data Science">Data Science</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Enrollment Year</label>
                            <input 
                                required
                                type="text" 
                                placeholder="21/22"
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                value={formData.enrollmentYear}
                                onChange={e => setFormData({...formData, enrollmentYear: e.target.value})}
                            />
                        </div>
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
                            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primaryHover hover-lift rounded-xl transition-all shadow-md shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
