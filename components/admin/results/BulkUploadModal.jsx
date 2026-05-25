"use client";

import { useState, useRef, useCallback } from 'react';
import {
  FileText, X, AlertCircle, CheckCircle2,
  ChevronDown, Loader2, Eye, Save, AlertTriangle, ScanLine
} from 'lucide-react';

const STEPS = ['Upload PDF', 'Verify Data', 'Confirm'];

const GRADE_COLORS = {
  'A+': 'bg-emerald-100 text-emerald-700',
  'A':  'bg-emerald-100 text-emerald-700',
  'A-': 'bg-emerald-100 text-emerald-700',
  'B+': 'bg-blue-100 text-blue-700',
  'B':  'bg-blue-100 text-blue-700',
  'B-': 'bg-blue-100 text-blue-700',
  'C+': 'bg-yellow-100 text-yellow-700',
  'C':  'bg-yellow-100 text-yellow-700',
  'C-': 'bg-yellow-100 text-yellow-700',
  'D+': 'bg-orange-100 text-orange-700',
  'D':  'bg-orange-100 text-orange-700',
  'E':  'bg-red-100 text-red-700',
  'F':  'bg-red-100 text-red-700',
};

export default function BulkUploadModal({ isOpen, onClose, config, onSuccess }) {
  const [step, setStep] = useState(0);
  const [filters, setFilters] = useState({
    academicYear: '', department: '', semester: '', subjectCode: '', subjectName: '', credits: 0,
  });
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const { academicYears = [], departments = [], semesters = [], subjects = {} } = config || {};

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const reset = () => {
    setStep(0);
    setFilters({ academicYear: '', department: '', semester: '', subjectCode: '', subjectName: '', credits: 0 });
    setFile(null);
    setPreviewData(null);
    setIsDragging(false);
  };

  const handleClose = () => { reset(); onClose(); };

  // ── Filter helpers ──
  const deptSubjects = subjects[filters.department] || [];
  const filteredSubjects = filters.semester
    ? deptSubjects.filter(s => s.semester === filters.semester)
    : deptSubjects;

  const handleFilterChange = (field, value) => {
    setFilters(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'department' || field === 'semester') {
        next.subjectCode = ''; next.subjectName = ''; next.credits = 0;
      }
      return next;
    });
  };

  const handleSubjectChange = (code) => {
    const sub = filteredSubjects.find(s => s.code === code);
    if (sub) {
      setFilters(prev => ({ ...prev, subjectCode: code, subjectName: sub.name, credits: sub.credits }));
    } else {
      handleFilterChange('subjectCode', code);
    }
  };

  const canProceed = filters.academicYear && filters.department && filters.semester && filters.subjectCode && file;

  // ── File drop ──
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.name.toLowerCase().endsWith('.pdf')) {
      setFile(f);
    } else {
      showToast('Only PDF files are accepted.', 'error');
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f && f.name.toLowerCase().endsWith('.pdf')) {
      setFile(f);
    } else if (f) {
      showToast('Only PDF files are accepted.', 'error');
    }
  };

  // ── Step 0 → 1: Scan PDF ──
  const handleScan = async () => {
    if (!canProceed) { showToast('Please fill all fields and select a PDF file.', 'error'); return; }
    setIsScanning(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('academicYear', filters.academicYear);
      fd.append('department', filters.department);
      fd.append('semester', filters.semester);
      fd.append('subjectCode', filters.subjectCode);
      fd.append('subjectName', filters.subjectName);
      fd.append('credits', filters.credits);

      const res = await fetch('/api/admin/result-uploads/bulk-upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'PDF scan failed.');
      setPreviewData(json.data);

      // If PDF mentions a different subject code, hint admin
      if (json.data.pdfSubjectHint && json.data.pdfSubjectHint !== filters.subjectCode) {
        showToast(`PDF may contain subject "${json.data.pdfSubjectHint}". Please verify the selected subject.`, 'warning');
      }

      setStep(1);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsScanning(false);
    }
  };

  // ── Step 1 → 2: Save Draft ──
  const handleSaveDraft = async () => {
    if (!previewData || previewData.validRows.length === 0) {
      showToast('No valid rows to save.', 'error'); return;
    }
    setIsSaving(true);
    try {
      const entries = previewData.validRows.map(r => ({ student: r.internalId, grade: r.grade }));
      const payload = {
        academicYear: filters.academicYear, department: filters.department,
        semester: filters.semester, subjectCode: filters.subjectCode,
        subjectName: filters.subjectName, credits: filters.credits, entries,
      };
      const res = await fetch('/api/admin/result-uploads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Save failed.');
      setStep(2);
      onSuccess && onSuccess();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg border text-sm font-semibold animate-fadeInUp ${
          toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700'
          : toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700'
          : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
          {toast.message}
        </div>
      )}

      <div className="bg-surface w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl border border-border flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#d4a843]/10 flex items-center justify-center">
              <ScanLine className="w-5 h-5 text-[#d4a843]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-textDark">PDF Result Scanner</h2>
              <p className="text-xs text-textMuted font-medium">Upload a result PDF to extract and verify student marks</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-xl hover:bg-border flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-textMuted" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? 'bg-emerald-500 text-white'
                  : i === step ? 'bg-[#d4a843] text-white'
                  : 'bg-border text-textMuted'}`}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${i === step ? 'text-textDark' : 'text-textMuted'}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-emerald-300' : 'bg-border'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* ─── STEP 0: Upload PDF ─── */}
          {step === 0 && (
            <>
              {/* Info banner */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <ScanLine className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-blue-800">How it works</p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    Upload the official result PDF. The system will automatically extract student numbers, subject codes, and marks from the document. You will then verify the data before saving.
                  </p>
                </div>
              </div>

              {/* Filters grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Academic Year */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Academic Year</label>
                  <div className="relative">
                    <select value={filters.academicYear} onChange={e => handleFilterChange('academicYear', e.target.value)}
                      className="w-full appearance-none bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#d4a843]/50 focus:ring-2 focus:ring-[#d4a843]/20 transition-all text-textDark">
                      <option value="">Select Year</option>
                      {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <ChevronDown className="w-4 h-4 text-textMuted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                {/* Department */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Department</label>
                  <div className="relative">
                    <select value={filters.department} onChange={e => handleFilterChange('department', e.target.value)}
                      className="w-full appearance-none bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#d4a843]/50 focus:ring-2 focus:ring-[#d4a843]/20 transition-all text-textDark">
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                    <ChevronDown className="w-4 h-4 text-textMuted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                {/* Semester */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Semester</label>
                  <div className="relative">
                    <select value={filters.semester} onChange={e => handleFilterChange('semester', e.target.value)}
                      className="w-full appearance-none bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#d4a843]/50 focus:ring-2 focus:ring-[#d4a843]/20 transition-all text-textDark">
                      <option value="">Select Semester</option>
                      {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="w-4 h-4 text-textMuted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-textMuted uppercase tracking-wider">Subject</label>
                  <div className="relative">
                    <select value={filters.subjectCode} onChange={e => handleSubjectChange(e.target.value)}
                      disabled={!filters.department || !filters.semester}
                      className="w-full appearance-none bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#d4a843]/50 focus:ring-2 focus:ring-[#d4a843]/20 transition-all text-textDark disabled:opacity-50 disabled:cursor-not-allowed">
                      <option value="">{!filters.department || !filters.semester ? 'Select dept & semester first' : 'Select Subject'}</option>
                      {filteredSubjects.map(s => <option key={s.code} value={s.code}>{s.code} — {s.name} ({s.credits} cr)</option>)}
                    </select>
                    <ChevronDown className="w-4 h-4 text-textMuted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* PDF drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragging ? 'border-[#d4a843] bg-[#d4a843]/5'
                  : file ? 'border-emerald-400 bg-emerald-50'
                  : 'border-border hover:border-[#d4a843]/50 hover:bg-[#d4a843]/5'}`}>
                <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    <p className="font-bold text-emerald-700 text-sm">{file.name}</p>
                    <p className="text-xs text-textMuted">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-10 h-10 text-textMuted" />
                    <p className="font-bold text-textDark text-sm">Drop your result PDF here</p>
                    <p className="text-xs text-textMuted">Supports .pdf · Text-based PDFs only · Click to browse</p>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-700 space-y-1">
                <p className="font-bold">PDF Requirements:</p>
                <p>• Must be a <strong>text-based PDF</strong> (not a scanned image/photo)</p>
                <p>• Should contain <strong>student roll/index numbers</strong> and <strong>marks (0–100)</strong></p>
                <p>• Subject codes in the PDF will be detected and shown for verification</p>
              </div>
            </>
          )}

          {/* ─── STEP 1: Verify Extracted Data ─── */}
          {step === 1 && previewData && (
            <>
              {/* Summary bar */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <p className="text-2xl font-black text-emerald-600">{previewData.validRows.length}</p>
                  <p className="text-xs font-semibold text-emerald-700 mt-1">Matched Students</p>
                </div>
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-center">
                  <p className="text-2xl font-black text-red-500">{previewData.invalidRows.length}</p>
                  <p className="text-xs font-semibold text-red-600 mt-1">Errors / Not Found</p>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                  <p className="text-2xl font-black text-blue-600">{previewData.totalRows}</p>
                  <p className="text-xs font-semibold text-blue-700 mt-1">Total Extracted</p>
                </div>
              </div>

              {/* PDF subject hint */}
              {previewData.pdfSubjectHint && previewData.pdfSubjectHint !== filters.subjectCode && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-300">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-700">Subject Code Detected in PDF</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      PDF contains subject code <strong>{previewData.pdfSubjectHint}</strong>, but you selected <strong>{filters.subjectCode}</strong>. Please verify this is correct before saving.
                    </p>
                  </div>
                </div>
              )}

              {/* Existing upload warning */}
              {previewData.hasExisting && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-300">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-700">Existing Upload Detected</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      A result upload already exists for this subject ({previewData.existingStatus}). Saving will fail with a duplicate error.
                    </p>
                  </div>
                </div>
              )}

              {/* Valid rows table */}
              {previewData.validRows.length > 0 && (
                <div className="rounded-2xl border border-border overflow-hidden">
                  <div className="px-4 py-3 border-b border-border flex items-center gap-2 bg-emerald-50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">Verified Entries ({previewData.validRows.length})</span>
                  </div>
                  <div className="overflow-x-auto max-h-52">
                    <table className="w-full text-sm">
                      <thead className="bg-background border-b border-border">
                        <tr className="text-xs uppercase tracking-wider text-textMuted">
                          <th className="py-2.5 px-4 text-left font-semibold">#</th>
                          <th className="py-2.5 px-4 text-left font-semibold">Student ID</th>
                          <th className="py-2.5 px-4 text-left font-semibold">Name</th>
                          <th className="py-2.5 px-4 text-center font-semibold">Marks</th>
                          <th className="py-2.5 px-4 text-center font-semibold">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.validRows.map((r, i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-black/[0.02]">
                            <td className="py-2.5 px-4 text-textMuted">{r.row}</td>
                            <td className="py-2.5 px-4 font-mono text-xs text-textDark">{r.studentId}</td>
                            <td className="py-2.5 px-4 font-semibold text-textDark">{r.studentName}</td>
                            <td className="py-2.5 px-4 text-center font-bold text-textDark">{r.marks}</td>
                            <td className="py-2.5 px-4 text-center">
                              <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${GRADE_COLORS[r.grade] || 'bg-gray-100 text-gray-700'}`}>{r.grade}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Error rows */}
              {previewData.invalidRows.length > 0 && (
                <div className="rounded-2xl border border-red-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-red-200 flex items-center gap-2 bg-red-50">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-bold text-red-600">Issues Found ({previewData.invalidRows.length}) — These rows will be skipped</span>
                  </div>
                  <div className="overflow-x-auto max-h-48">
                    <table className="w-full text-sm">
                      <thead className="bg-red-50/50 border-b border-red-200">
                        <tr className="text-xs uppercase tracking-wider text-red-500">
                          <th className="py-2.5 px-4 text-left font-semibold">Row</th>
                          <th className="py-2.5 px-4 text-left font-semibold">Student ID</th>
                          <th className="py-2.5 px-4 text-left font-semibold">Issue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.invalidRows.map((r, i) => (
                          <tr key={i} className="border-b border-red-100">
                            <td className="py-2.5 px-4 text-red-400 font-mono text-xs">{r.row}</td>
                            <td className="py-2.5 px-4 font-mono text-xs text-red-600">{r.studentId || '—'}</td>
                            <td className="py-2.5 px-4 text-red-600 text-xs">{r.errors.join('; ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ─── STEP 2: Done ─── */}
          {step === 2 && (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-black text-textDark">Draft Saved Successfully!</h3>
              <p className="text-sm text-textMuted max-w-sm">
                {previewData?.validRows?.length} student results have been saved as a draft for <strong>{filters.subjectCode}</strong>.
                Go to the upload list to review and publish the results.
              </p>
              <button onClick={handleClose}
                className="mt-2 px-6 py-2.5 bg-[#d4a843] text-white rounded-xl font-semibold text-sm hover:bg-[#b8912e] transition-all">
                Done
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {step < 2 && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-between shrink-0">
            <button onClick={step === 0 ? handleClose : () => setStep(0)}
              className="px-4 py-2.5 text-sm font-semibold text-textMuted hover:text-textDark transition-colors">
              {step === 0 ? 'Cancel' : '← Back'}
            </button>

            {step === 0 && (
              <button onClick={handleScan} disabled={!canProceed || isScanning}
                className="flex items-center gap-2 bg-[#d4a843] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#b8912e] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#d4a843]/20">
                {isScanning
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning PDF...</>
                  : <><ScanLine className="w-4 h-4" /> Scan & Extract Data</>}
              </button>
            )}

            {step === 1 && (
              <button onClick={handleSaveDraft}
                disabled={isSaving || !previewData || previewData.validRows.length === 0}
                className="flex items-center gap-2 bg-[#d4a843] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#b8912e] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#d4a843]/20">
                {isSaving
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  : <><Save className="w-4 h-4" /> Save {previewData?.validRows?.length || 0} Results as Draft</>}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
