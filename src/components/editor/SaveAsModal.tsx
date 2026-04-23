import React, { useEffect, useRef, useState } from 'react';

interface SaveAsModalProps {
  isOpen: boolean;
  defaultName: string;
  toolName: string;
  onConfirm: (fileName: string) => void;
  onCancel: () => void;
}

export const SaveAsModal: React.FC<SaveAsModalProps> = ({
  isOpen,
  defaultName,
  toolName,
  onConfirm,
  onCancel,
}) => {
  const [fileName, setFileName] = useState(defaultName);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset name and focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setFileName(defaultName);
      // Small delay to allow animation to complete
      setTimeout(() => inputRef.current?.select(), 80);
    }
  }, [isOpen, defaultName]);

  // Escape closes, Enter confirms
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') handleConfirm();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, fileName]);

  const handleConfirm = () => {
    const trimmed = fileName.trim();
    onConfirm(trimmed || defaultName);
  };

  if (!isOpen) return null;

  return (
    <div
      className="filepicker-modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 animate-[slideUp_0.2s_ease-out]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-400">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">Save As</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{toolName}</p>
          </div>
          <button
            onClick={onCancel}
            className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* File name input */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
            File name
          </label>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-red-500 focus:outline-none transition-all text-sm"
              placeholder="Enter file name..."
            />
            <span className="flex-shrink-0 text-sm text-slate-400 dark:text-slate-500 font-mono">.pdf</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            Leave blank to use the default name
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
          >
            Save & Download
          </button>
        </div>
      </div>
    </div>
  );
};
