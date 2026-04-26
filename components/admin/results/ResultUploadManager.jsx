"use client";

import { useState, useEffect, useCallback } from 'react';
import { Plus, ArrowLeft, Save, Send, Loader2 } from 'lucide-react';
import FilterPanel from './FilterPanel';
import GradeEntryTable from './GradeEntryTable';
import PublishConfirmModal from './PublishConfirmModal';
import ResultUploadList from './ResultUploadList';

const INITIAL_FILTERS = {
    academicYear: '',
    department: '',
    batch: '',
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
            if (field === 'department' || field === 'batch') {
                // Reset students when key filter changes
                setStudents([]);
                setGrades({});
                setValidationErrors({});
            }

            return updated;
        });
    };

    // ── Fetch students based on department + batch ──
    const fetchStudents = async () => {
        if (!filters.department || !filters.batch) return;

        setIsLoadingStudents(true);
        setValidationErrors({});

        try {
            const res = await fetch('/api/students');
            const data = await res.json();

            // Filter locally by department and batch (enrollmentYear)
            const studentsArray = Array.isArray(data) ? data : data.data || [];
            const filtered = studentsArray.filter((s) => {
                const matchesDept = s.department === filters.department;
                const matchesBatch = s.enrollmentYear === filters.batch;
                return matchesDept && matchesBatch;
            });

            // Serialize _id
            const serialized = filtered.map((s) => ({
                ...s,
                _id: s._id?.toString ? s._id.toString() : s._id,
            }));

            setStudents(serialized);

            // Initialize grades (empty for new, or preserve existing)
            if (view === 'new') {
                const initialGrades = {};
                serialized.forEach((s) => {
                    initialGrades[s._id] = '';
                });
                setGrades(initialGrades);
            }

            if (serialized.length === 0) {
                showToast('No students found for the selected department and batch.', 'warning');
            } else {
                showToast(`${serialized.length} student(s) loaded successfully.`);
            }
        } catch (err) {
            console.error('Failed to fetch students:', err);
            showToast('Failed to load students. Please try again.', 'error');
        } finally {
            setIsLoadingStudents(false);
        }
    };

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
