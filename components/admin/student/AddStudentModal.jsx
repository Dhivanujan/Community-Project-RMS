"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { createStudent } from '@/actions/auth';

export default function AddStudentModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        indexNumber: '',
        email: '',
        department: '',
        enrollmentYear: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen) return null;
    if (!mounted) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Auto-generate username from indexNumber
            const username = formData.indexNumber.replace(/[\/\?]/g, '').toLowerCase();
            
            const result = await createStudent({
                ...formData,
                username
            });

            if (result.error) {
                throw new Error(result.error);
            }

            // Successfully added
            setIsSuccess(true);
            
            // Format for local state update
            const newStudent = {
                id: Math.random().toString(), // Will be refreshed on next load
                name: `${formData.firstName} ${formData.lastName}`,
                firstName: formData.firstName,
                lastName: formData.lastName,
                rollNumber: formData.indexNumber,
                indexNumber: formData.indexNumber,
                email: formData.email,
                username: username,
                department: formData.department,
                enrollmentYear: formData.enrollmentYear,
                createdAt: new Date().toISOString()
            };

            // Don't close immediately so they can see the password
            // onSuccess(newStudent);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (isSuccess) {
            window.location.reload(); // Trigger refresh properly
        }
        setFormData({
            firstName: '',
            lastName: '',
            indexNumber: '',
            email: '',
            department: '',
            enrollmentYear: ''
        });
        setIsSuccess(false);
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                onClick={handleClose}
            ></div>

            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {isSuccess ? 'Success' : 'Add New Student'}
                    </h3>
                    <button 
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full p-2 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {isSuccess ? (
                    <div className="p-8 text-center space-y-6">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <div>
                            <p className="text-slate-900 dark:text-white font-bold text-xl">Student added successfully.</p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl border border-red-100 dark:border-red-900/30">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">First Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:text-white outline-none transition-all"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:text-white outline-none transition-all"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Index Number</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:text-white outline-none transition-all"
                                    placeholder="19/APSE/001"
                                    value={formData.indexNumber}
                                    onChange={e => setFormData({...formData, indexNumber: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</label>
                                <input 
                                    required
                                    type="email" 
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:text-white outline-none transition-all"
                                    placeholder="john@foc.sab.ac.lk"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</label>
                                <select 
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:text-white outline-none transition-all appearance-none"
                                    value={formData.department}
                                    onChange={e => setFormData({...formData, department: e.target.value})}
                                >
                                    <option value="" disabled className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">Select Dept</option>
                                    <option value="Software Engineering" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">Software Engineering</option>
                                    <option value="Computer Information Systems" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">Computer Information Systems</option>
                                    <option value="Data Science" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">Data Science</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Enrollment Year</label>
                                <input 
                                    required
                                    type="text" 
                                    pattern="\d{4}/\d{4}"
                                    placeholder="2021/2022"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:text-white outline-none transition-all"
                                    value={formData.enrollmentYear}
                                    onChange={e => setFormData({...formData, enrollmentYear: e.target.value})}
                                    title="Format must be YYYY/YYYY (e.g., 2021/2022)"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-100 dark:shadow-none disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Student Account'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>,
        document.body
    );
}
