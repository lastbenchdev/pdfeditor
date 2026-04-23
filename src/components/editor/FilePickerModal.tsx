import React, { useEffect, useCallback } from 'react';
import { FilePicker } from '../tool/FilePicker';

interface FilePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesSelected: (files: File[]) => void;
  multiple: boolean;
  maxFiles: number;
}

export const FilePickerModal: React.FC<FilePickerModalProps> = ({
  isOpen,
  onClose,
  onFilesSelected,
  multiple,
  maxFiles
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleFilesSelected = (files: File[]) => {
    onFilesSelected(files);
    if (files.length > 0) {
      onClose();
    }
  };

  return (
    <div
      className="filepicker-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="filepicker-modal-content bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Open PDF File
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {multiple ? 'Select multiple PDF files to work with.' : 'Select a PDF file to edit.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <FilePicker
          onFilesSelected={handleFilesSelected}
          multiple={multiple}
          maxFiles={maxFiles}
        />
      </div>
    </div>
  );
};
