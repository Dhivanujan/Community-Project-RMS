"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, title, description, children, size = "md", className = "" }) {
  const overlayRef = useRef(null);
  
  // Dragging state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
    } else {
      document.body.style.userSelect = "";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, [isDragging, dragStart]);

  const handleMouseDown = (e) => {
    if (e.target.closest("button")) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (!mounted) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
  };

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex justify-center items-start pt-4 sm:pt-8 p-4"
      onMouseDown={(e) => e.target === overlayRef.current && onClose?.()}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" />

      {/* Dialog */}
      <div
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        className={`relative w-full ${sizes[size]} bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-modalIn flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden ${className} ${isDragging ? "transition-none" : ""}`}
      >
        {/* Header */}
        {(title || description) && (
          <div 
            onMouseDown={handleMouseDown}
            className="flex-shrink-0 flex items-start justify-between px-6 pt-6 pb-3 cursor-move select-none bg-white dark:bg-slate-900 z-10"
          >
            <div>
              {title && (
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              onMouseDown={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 ml-4"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1 min-h-0 relative">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
