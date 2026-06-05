"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Book, LifeBuoy } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen) return null;
    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fadeIn" 
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden animate-fadeInUp transition-colors duration-300">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary-900 to-primary-700 opacity-10"></div>
                
                <div className="relative px-8 pt-8 pb-6 flex flex-col items-center text-center">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-2 transition-all active:scale-95"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-900 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/20 mb-4 ring-4 ring-white dark:ring-slate-900">
                        <LifeBuoy className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Help & Support</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">RMS Admin Portal v1.0.0</p>
                </div>

                <div className="px-8 pb-8 space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex items-start gap-4 hover:border-primary-900/20 transition-colors group cursor-pointer">
                        <div className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-primary-900/30">
                            <Book className="w-5 h-5 text-primary-900" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Documentation</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Read the system user guide and FAQs.</p>
                        </div>
                    </div>

                    <a href="mailto:support@faculty.edu" className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex items-start gap-4 hover:border-primary-900/20 transition-colors group cursor-pointer block text-left">
                        <div className="flex items-start gap-4">
                            <div className="bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-primary-900/30 shrink-0">
                                <Mail className="w-5 h-5 text-primary-900" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Contact IT Support</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">support@faculty.edu</p>
                            </div>
                        </div>
                    </a>

                    <div className="pt-2 mt-2">
                        <button
                            onClick={onClose}
                            className="w-full py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
