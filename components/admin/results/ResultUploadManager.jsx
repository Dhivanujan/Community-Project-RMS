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
