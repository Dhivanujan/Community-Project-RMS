"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/super-admin/Sidebar';
import Topbar from '@/components/super-admin/Topbar';
import { ToastProvider } from '@/components/ui/Toast';

export default function SuperAdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('sa-dark-mode');
        if (saved === 'true') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(prev => {
            const next = !prev;
            localStorage.setItem('sa-dark-mode', String(next));
            if (next) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return next;
        });
    };

    return (
        <ToastProvider>
            <div className={`flex min-h-screen bg-[#f8f9fc] dark:bg-slate-950 font-sans transition-colors duration-300`}>
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="flex-1 ml-0 lg:ml-64 flex flex-col relative transition-all duration-300">
                    <Topbar onMenuClick={() => setIsSidebarOpen(true)} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                    <main className="flex-1 px-4 lg:px-8 py-7 max-w-[1440px] w-full mx-auto animate-fadeInUp overflow-x-hidden">
                        {children}
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}
