"use client";

import { useState } from 'react';
import StudentTable from './StudentTable';
import AddStudentModal from './AddStudentModal';
import { Plus } from 'lucide-react';

export default function StudentManager({ initialStudents }) {
    const [students, setStudents] = useState(initialStudents);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleStudentAdded = (newStudent) => {
        setStudents(prev => [newStudent, ...prev]);
        setIsAddModalOpen(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this student?")) return;
        
        try {
            const res = await fetch(`/api/students/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setStudents(prev => prev.filter(s => s._id !== id));
            } else {
                alert("Failed to delete student. (API might not be fully implemented yet)");
            }
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fadeInUp">
            {/* Top Bar for Manager: Search & Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface p-4 rounded-2xl shadow-sm border border-border">
                <input
                    type="text"
                    placeholder="Search by name, roll number, or email..."
                    className="w-full sm:max-w-md bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-textDark placeholder:text-textMuted"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition-all active:scale-[0.98] shadow-sm shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Student</span>
                </button>
            </div>

            {/* Table Component */}
            <StudentTable 
                students={filteredStudents} 
                onDelete={handleDelete}
            />

            {/* Add Student Modal Component */}
            <AddStudentModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSuccess={handleStudentAdded} 
            />
        </div>
    );
}
