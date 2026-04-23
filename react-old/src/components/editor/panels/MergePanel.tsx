import React from 'react';

interface MergePanelProps {
  fileCount: number;
}

export const MergePanel: React.FC<MergePanelProps> = ({ fileCount }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Select multiple files, reorder in the list, and merge them into one document.
      </p>
      <div className="rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-3 flex items-center gap-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 flex-shrink-0">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white">{fileCount}</span> file{fileCount !== 1 ? 's' : ''} selected
          {fileCount < 2 && <span className="text-red-500 ml-1">· Add at least 2</span>}
        </p>
      </div>
    </div>
  );
};
