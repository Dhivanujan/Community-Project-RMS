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

    