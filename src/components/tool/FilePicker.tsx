import React, { useRef, useState, useCallback } from 'react';
import { FileUpIcon, TrashIcon, FileTextIcon, LayersIcon } from '../Icons';
import { Reorder, AnimatePresence } from 'framer-motion';

interface FilePickerProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}

export const FilePicker: React.FC<FilePickerProps> = ({ 
  onFilesSelected, 
  multiple = true,
  maxFiles = 10 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    
    if (newFiles.length === 0) {
      alert('Please select PDF files only.');
      return;
    }

    const updated = multiple ? [...selectedFiles, ...newFiles] : [newFiles[0]];
    const limited = updated.slice(0, maxFiles);
    
    setSelectedFiles(limited);
    onFilesSelected(limited);
  }, [multiple, selectedFiles, maxFiles, onFilesSelected]);

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFilesSelected(updated);
  };

  const handleReorder = (newOrder: File[]) => {
    setSelectedFiles(newOrder);
    onFilesSelected(newOrder);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`relative group border-2 border-dashed rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer
          ${isDragging 
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
            : 'border-slate-200 dark:border-slate-700 hover:border-red-400 hover:bg-slate-50 dark:hover:bg-slate-800/70'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        
        <div className={`pointer-events-none p-6 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 mb-4 transition-transform duration-300 group-hover:scale-110 
          ${isDragging ? 'scale-110 bg-red-100 dark:bg-red-900/50' : ''}`}>
          <FileUpIcon className="w-12 h-12" />
        </div>
        
        <h3 className="pointer-events-none text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {isDragging ? 'Drop it here!' : 'Click or drag files here'}
        </h3>
        <p className="pointer-events-none text-slate-500 dark:text-slate-400 text-center max-w-md">
          Select PDF files from your computer. Your files stay on your device for maximum privacy.
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-12 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {multiple ? 'Arrange & Manage Files' : 'Selected File'} ({selectedFiles.length}/{maxFiles})
            </h4>
            {multiple && selectedFiles.length > 1 && (
              <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <LayersIcon className="w-3 h-3" /> Drag to reorder
              </span>
            )}
          </div>
          
          <Reorder.Group 
            axis="y" 
            values={selectedFiles} 
            onReorder={handleReorder}
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {selectedFiles.map((file, index) => (
                <Reorder.Item 
                  key={`${file.name}-${index}`} 
                  value={file}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg">
                      <FileTextIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-[200px] sm:max-w-xs">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        </div>
      )}
    </div>
  );
};
