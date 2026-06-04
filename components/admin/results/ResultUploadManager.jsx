"use client";

import { useState, useEffect, useCallback } from 'react';
import { Plus, ArrowLeft, Save, Send, Loader2, ScanLine } from 'lucide-react';
import FilterPanel from './FilterPanel';
import GradeEntryTable from './GradeEntryTable';
import PublishConfirmModal from './PublishConfirmModal';
import ResultUploadList from './ResultUploadList';
import BulkUploadModal from './BulkUploadModal';

const INITIAL_FILTERS = {
    academicYear: '',
    department: '',
    semester: '',
    subjectCode: '',
    subjectName: '',
    credits: 0,
};

export default function ResultUploadManager() {
    // ── Core State ──
    const [view, setView] = useState('list'); // 'list' | 'new' | 'edit'
    const [config, setConfig] = useState({});
    const [uploads, setUploads] = useState([]);
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [editingUploadId, setEditingUploadId] = useState(null);
    const [editingUploadStatus, setEditingUploadStatus] = useState('draft');

    // ── Loading / Error State ──
    const [isLoadingConfig, setIsLoadingConfig] = useState(true);
    const [isLoadingUploads, setIsLoadingUploads] = useState(false);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [toast, setToast] = useState(null);

    // ── Show toast notifications ──
    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    }, []);

    // ── Fetch config on mount ──
    useEffect(() => {
        async function loadConfig() {
            try {
                const res = await fetch('/api/admin/result-uploads/config');
                const json = await res.json();
                if (json.success) {
                    setConfig(json.data);
                }
            } catch (err) {
                console.error('Failed to load config:', err);
            } finally {
                setIsLoadingConfig(false);
            }
        }
        loadConfig();
    }, []);

    // ── Fetch uploads list ──
    const loadUploads = useCallback(async () => {
        setIsLoadingUploads(true);
        try {
            const res = await fetch('/api/admin/result-uploads');
            const json = await res.json();
            if (json.success) {
                setUploads(json.data);
            }
        } catch (err) {
            console.error('Failed to load uploads:', err);
        } finally {
            setIsLoadingUploads(false);
        }
    }, []);

    useEffect(() => {
        loadUploads();
    }, [loadUploads]);

    // ── Handle filter changes ──
    const handleFilterChange = (field, value) => {
        setFilters((prev) => {
            const updated = { ...prev, [field]: value };

            // Reset dependent fields
            if (field === 'department' || field === 'semester') {
                updated.subjectCode = '';
                updated.subjectName = '';
                updated.credits = 0;
            }
            if (field === 'department') {
                // Reset students when key filter changes
                setStudents([]);
                setGrades({});
                setValidationErrors({});
            }

            return updated;
        });
    };

    // ── Fetch students based on department and academic year ──
    const fetchStudents = useCallback(async () => {
        if (!filters.department || !filters.academicYear) {
            showToast('Please select both Academic Year and Department first.', 'warning');
            return;
        }

        setIsLoadingStudents(true);
        setValidationErrors({});

        try {
            const res = await fetch('/api/students');
            const data = await res.json();

            // Filter locally by department and academicYear as enrollmentYear
            const studentsArray = Array.isArray(data) ? data : data.data || [];
            const filtered = studentsArray.filter((s) => {
                const isDeptMatch = s.department === filters.department;
                
                // Allow exact match or matching the first year in the string "2021/2022" -> "2021"
                const sYear = String(s.enrollmentYear || '').trim();
                const fYear = String(filters.academicYear || '').trim();
                
                const isYearMatch = sYear === fYear || 
                                    (fYear.includes('/') && sYear === fYear.split('/')[0]) ||
                                    (sYear.includes('/') && fYear === sYear.split('/')[0]);
                
                return isDeptMatch && isYearMatch;
            });

            // Serialize _id
            const serialized = filtered.map((s) => ({
                ...s,
                _id: s._id?.toString ? s._id.toString() : s._id,
            }));

            setStudents(serialized);

            // Initialize grades (empty for new, or preserve existing)
            let initialGrades = {};
            if (view === 'new') {
                serialized.forEach((s) => {
                    initialGrades[s._id] = '';
                });
                setGrades(initialGrades);
            }

            if (serialized.length === 0) {
                showToast(`No students found for ${filters.department} in ${filters.academicYear}.`, 'warning');
            } else {
                showToast(`${serialized.length} student(s) loaded successfully.`);
            }
        } catch (err) {
            console.error('Failed to fetch students:', err);
            showToast('Failed to load students. Please try again.', 'error');
        } finally {
            setIsLoadingStudents(false);
        }
    }, [filters.department, filters.academicYear, view]);

    useEffect(() => {
        if (filters.department && filters.academicYear && view === 'new') {
            fetchStudents();
        }
    }, [filters.department, filters.academicYear, view, fetchStudents]);

    // ── Handle grade change ──
    const handleGradeChange = (studentId, grade) => {
        setGrades((prev) => ({ ...prev, [studentId]: grade }));
        setValidationErrors((prev) => {
            const updated = { ...prev };
            delete updated[studentId];
            return updated;
        });
    };

    // ── Handle batch grade ──
    const handleBatchGrade = (grade) => {
        const updated = {};
        students.forEach((s) => {
            updated[s._id] = grade;
        });
        setGrades(updated);
        setValidationErrors({});
    };

    // ── Validate before save/publish ──
    const validate = () => {
        const errors = {};
        let hasErrors = false;

        // Check filters
        if (!filters.academicYear || !filters.department || !filters.semester || !filters.subjectCode) {
            showToast('Please select all filter fields before publishing.', 'error');
            return false;
        }

        // Check grades
        students.forEach((s) => {
            if (!grades[s._id]) {
                errors[s._id] = true;
                hasErrors = true;
            }
        });

        setValidationErrors(errors);

        if (hasErrors) {
            showToast('Please assign grades to all students.', 'error');
            return false;
        }

        return true;
    };

    // ── Save as draft ──
    const handleSave = async () => {
        if (!validate()) return;

        setIsSaving(true);
        try {
            const entries = students.map((s) => ({
                student: s._id,
                grade: grades[s._id],
            }));

            const payload = {
                academicYear: filters.academicYear,
                department: filters.department,
                semester: filters.semester,
                subjectCode: filters.subjectCode,
                subjectName: filters.subjectName,
                credits: filters.credits,
                entries,
            };

            let res;
            if (editingUploadId) {
                // Update existing
                res = await fetch(`/api/admin/result-uploads/${editingUploadId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ entries }),
                });
            } else {
                // Create new
                res = await fetch('/api/admin/result-uploads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || 'Save failed');
            }

            showToast(json.message || 'Saved successfully!');
            resetForm();
            setView('list');
            loadUploads();
        } catch (err) {
            showToast(err.message || 'Failed to save. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // ── Publish ──
    const handlePublish = async () => {
        if (!editingUploadId) {
            // Need to save first before publishing
            if (!validate()) return;

            setIsSaving(true);
            try {
                const entries = students.map((s) => ({
                    student: s._id,
                    grade: grades[s._id],
                }));

                const payload = {
                    academicYear: filters.academicYear,
                    department: filters.department,
                    semester: filters.semester,
                    subjectCode: filters.subjectCode,
                    subjectName: filters.subjectName,
                    credits: filters.credits,
                    entries,
                };

                const createRes = await fetch('/api/admin/result-uploads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const createJson = await createRes.json();
                if (!createRes.ok) throw new Error(createJson.message || 'Failed to save draft before publishing');

                setEditingUploadId(createJson.data._id);
                setIsSaving(false);

                // Now publish
                await publishUpload(createJson.data._id);
            } catch (err) {
                showToast(err.message || 'Failed to save before publish.', 'error');
                setIsSaving(false);
                setIsPublishModalOpen(false); // Close modal on failure
            }
            return;
        }

        // If editing, update first then publish
        if (editingUploadStatus === 'draft') {
            try {
                const entries = students.map((s) => ({
                    student: s._id,
                    grade: grades[s._id],
                }));

                const putRes = await fetch(`/api/admin/result-uploads/${editingUploadId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ entries }),
                });

                if (!putRes.ok) {
                    const putJson = await putRes.json();
                    throw new Error(putJson.message || 'Failed to update draft before publishing');
                }
            } catch (err) {
                showToast(err.message, 'error');
                setIsPublishModalOpen(false);
                return; // Stop publish if update fails
            }
        }

        await publishUpload(editingUploadId);
    };

    const publishUpload = async (uploadId) => {
        setIsPublishing(true);
        try {
            const res = await fetch(`/api/admin/result-uploads/${uploadId}/publish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const json = await res.json();

            if (!res.ok) throw new Error(json.message);

            showToast(json.message || 'Results published successfully!');
            setIsPublishModalOpen(false);
            resetForm();
            setView('list');
            loadUploads();
        } catch (err) {
            showToast(err.message || 'Failed to publish. Please try again.', 'error');
            setIsPublishModalOpen(false);
        } finally {
            setIsPublishing(false);
        }
    };

    // ── Delete upload ──
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this draft?')) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/result-uploads/${id}`, {
                method: 'DELETE',
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message);

            showToast('Draft deleted successfully.');
            loadUploads();
        } catch (err) {
            showToast(err.message || 'Failed to delete.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    // ── View/Edit existing upload ──
    const handleViewOrEdit = async (id, mode = 'edit') => {
        try {
            const res = await fetch(`/api/admin/result-uploads/${id}`);
            const json = await res.json();

            if (!json.success) throw new Error(json.message);

            const data = json.data;

            // Set filters
            setFilters({
                academicYear: data.academicYear,
                department: data.department,
                semester: data.semester,
                subjectCode: data.subjectCode,
                subjectName: data.subjectName,
                credits: data.credits,
            });

            // Set students and grades from entries
            const loadedStudents = data.entries
                .filter((e) => e.student)
                .map((e) => ({
                    _id: e.student._id,
                    name: e.student.name,
                    rollNumber: e.student.rollNumber,
                    email: e.student.email,
                    department: e.student.department,
                    enrollmentYear: e.student.enrollmentYear,
                }));

            const loadedGrades = {};
            data.entries.forEach((e) => {
                if (e.student) {
                    loadedGrades[e.student._id] = e.grade;
                }
            });

            setStudents(loadedStudents);
            setGrades(loadedGrades);
            setEditingUploadId(id);
            setEditingUploadStatus(data.status);
            setValidationErrors({});
            setView('edit');
        } catch (err) {
            showToast('Failed to load upload details.', 'error');
        }
    };

    // ── Reset form ──
    const resetForm = () => {
        setFilters(INITIAL_FILTERS);
        setStudents([]);
        setGrades({});
        setValidationErrors({});
        setEditingUploadId(null);
        setEditingUploadStatus('draft');
    };

    // ── Start new upload ──
    const startNewUpload = () => {
        resetForm();
        setView('new');
    };

    // ── Compute grade distribution for publish modal ──
    const gradeDistribution = {};
    Object.values(grades).forEach((g) => {
        if (g) gradeDistribution[g] = (gradeDistribution[g] || 0) + 1;
    });

    const allGradesAssigned = students.length > 0 && students.every((s) => grades[s._id]);

    // ── Loading State ──
    if (isLoadingConfig) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6 animate-fadeInUp">
                {/* ═══════════ LIST VIEW ═══════════ */}
                {view === 'list' && (
                    <>
                        {/* Top Action Bar */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface p-4 rounded-2xl shadow-sm border border-border">
                            <p className="text-sm text-textMuted font-medium">
                                {uploads.length} result upload(s) total
                            </p>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                {/* Bulk Upload */}
                                <button
                                    onClick={() => setIsBulkModalOpen(true)}
                                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-all active:scale-[0.98] shadow-sm shadow-emerald-600/20"
                                >
                                    <ScanLine className="w-4 h-4" />
                                    <span>Scan PDF</span>
                                </button>
                                {/* Manual Upload */}
                                <button
                                    onClick={startNewUpload}
                                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-[#d4a843] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#b8912e] transition-all active:scale-[0.98] shadow-sm shadow-[#d4a843]/20"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Manual Entry</span>
                                </button>
                            </div>
                        </div>

                        {/* Upload List */}
                        {isLoadingUploads ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                            </div>
                        ) : (
                            <ResultUploadList
                                uploads={uploads}
                                onView={(id) => handleViewOrEdit(id, 'view')}
                                onEdit={(id) => handleViewOrEdit(id, 'edit')}
                                onDelete={handleDelete}
                                isDeleting={isDeleting}
                            />
                        )}
                    </>
                )}

                {/* ═══════════ NEW / EDIT VIEW ═══════════ */}
                {(view === 'new' || view === 'edit') && (
                    <>
                        {/* Back + Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-4 rounded-2xl shadow-sm border border-border">
                            <button
                                onClick={() => {
                                    resetForm();
                                    setView('list');
                                }}
                                className="flex items-center gap-2 text-sm font-semibold text-textMuted hover:text-textDark transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Uploads
                            </button>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                {/* Save Draft */}
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || students.length === 0}
                                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-background border border-border text-textDark px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {editingUploadId ? 'Update' : 'Save Draft'}
                                </button>

                                {/* Publish */}
                                {editingUploadStatus !== 'published' && (
                                    <button
                                        onClick={() => {
                                            if (!validate()) return;
                                            setIsPublishModalOpen(true);
                                        }}
                                        disabled={!allGradesAssigned || isSaving}
                                        className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-4 h-4" />
                                        Publish Results
                                    </button>
                                )}

                                {editingUploadStatus === 'published' && (
                                    <span className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500/10 text-emerald-600 text-sm font-bold rounded-xl">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        Published
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Filter Panel */}
                        <FilterPanel
                            config={config}
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onFetchStudents={fetchStudents}
                            isLoadingStudents={isLoadingStudents}
                            disabled={view === 'edit'}
                        />

                        {/* Grade Entry Table */}
                        <GradeEntryTable
                            students={students}
                            grades={grades}
                            onGradeChange={handleGradeChange}
                            onBatchGrade={handleBatchGrade}
                            validationErrors={validationErrors}
                            disabled={false}
                            isPublished={editingUploadStatus === 'published'}
                        />
                    </>
                )}
            </div>

            {/* ═══════════ FIXED-POSITION ELEMENTS (outside animated container) ═══════════ */}

            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg border animate-fadeInUp text-sm font-semibold ${
                        toast.type === 'error'
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : toast.type === 'warning'
                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}
                >
                    {toast.message}
                </div>
            )}

            {/* Publish Confirmation Modal */}
            <PublishConfirmModal
                isOpen={isPublishModalOpen}
                onClose={() => setIsPublishModalOpen(false)}
                onConfirm={handlePublish}
                isPublishing={isPublishing}
                uploadData={{
                    subjectCode: filters.subjectCode,
                    subjectName: filters.subjectName,
                    semester: filters.semester,
                    department: filters.department,
                    studentCount: students.length,
                    gradeDistribution,
                }}
            />

            {/* Bulk Upload Modal */}
            <BulkUploadModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                config={config}
                onSuccess={() => {
                    setIsBulkModalOpen(false);
                    loadUploads();
                    showToast('Bulk upload saved as draft! Review and publish from the list.');
                }}
            />
        </>
    );
}
