import React from 'react';
import { toolsData } from '../../data/tools';
import { isSupportedEditorToolId, type SupportedEditorToolId } from '../../lib/pdf/operation-registry';
import { FileUpIcon } from '../Icons';

interface EditorToolbarProps {
  activeToolId: SupportedEditorToolId;
  onToolChange: (toolId: SupportedEditorToolId) => void;
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onOpenFile: () => void;
  hasFile: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  activeToolId,
  onToolChange,
  pageCount,
  currentPage,
  onPageChange,
  onOpenFile,
  hasFile
}) => {
  const editorTools = toolsData.filter((tool) => isSupportedEditorToolId(tool.id));

  return (
    <div className="px-4 py-2.5 flex items-center gap-3 bg-white dark:bg-slate-900">
      {/* Open File Button */}
      <button
        type="button"
        onClick={onOpenFile}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex-shrink-0"
      >
        <FileUpIcon className="w-4 h-4" />
        Open File
      </button>

      {/* Divider */}
      <div className="w-px h-7 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />

      {/* Tool Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto flex-1 min-w-0">
        {editorTools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => onToolChange(tool.id as SupportedEditorToolId)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap flex-shrink-0 ${
              activeToolId === tool.id
                ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {tool.name}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-7 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />

      {/* Page Navigation */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={!hasFile || currentPage <= 1}
          className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 min-w-[70px] text-center">
          {pageCount > 0 ? `${currentPage} / ${pageCount}` : 'No file'}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
          disabled={!hasFile || currentPage >= pageCount}
          className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};
