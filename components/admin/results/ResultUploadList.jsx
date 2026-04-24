"use client";

import { Eye, Edit3, Trash2, FileText, Search } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useState } from 'react';

export default function ResultUploadList({
    uploads,
    onView,
    onEdit,
    onDelete,
    isDeleting,
}) {
   