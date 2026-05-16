"use client";

import { useState } from 'react';
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
    const [tempPassword, setTempPassword] = useState(null);

    if (!isOpen) return null;

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
            setTempPassword(result.tempPassword);
            
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
        if (tempPassword) {
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
        setTempPassword(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                onClick={handleClose}
            ></div>

            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900">
                        {tempPassword ? 'Student Created Successfully' : 'Add New Student'}
                    </h3>
                    <button 
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full p-2 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {tempPassword ? (
                    <div className="p-8 text-center space-y-6">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <div>
                            <p className="text-slate-600 font-medium">Please provide this temporary password to the student:</p>
                            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-green-200">
                                <span className="text-2xl font-mono font-bold text-slate-900 tracking-wider">
                                    {tempPassword}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-4 italic">
                                The student will be forced to change this on their first login.
                            </p>
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
                            <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Index Number</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                                    placeholder="19/APSE/001"
                                    value={formData.indexNumber}
                                    onChange={e => setFormData({...formData, indexNumber: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                                <input 
                                    required
                                    type="email" 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                                    placeholder="john@foc.sab.ac.lk"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                                <select 
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all appearance-none"
                                    value={formData.department}
                                    onChange={e => setFormData({...formData, department: e.target.value})}
                                >
                                    <option value="" disabled>Select Dept</option>
                                    <option value="Software Engineering">Software Engineering</option>
                                    <option value="Computer Information Systems">Computer Information Systems</option>
                                    <option value="Data Science">Data Science</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enrollment Year</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="2024"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                                    value={formData.enrollmentYear}
                                    onChange={e => setFormData({...formData, enrollmentYear: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Student Account'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
