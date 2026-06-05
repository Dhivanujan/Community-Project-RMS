"use client";

import { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('admin-dark-mode');
        if (saved === 'true') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(prev => {
            const next = !prev;
            localStorage.setItem('admin-dark-mode', String(next));
            if (next) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return next;
        });
    };

    return (
        <div className="flex min-h-screen bg-[#f8f9fc] dark:bg-slate-950 font-sans transition-colors duration-300">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 ml-0 lg:ml-64 flex flex-col relative transition-all duration-300">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                <main className="flex-1 px-4 lg:px-8 py-7 max-w-[1400px] overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}