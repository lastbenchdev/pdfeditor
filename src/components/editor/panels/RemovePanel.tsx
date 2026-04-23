import React from 'react';
import { PageSelectionPanel } from '../PageSelectionPanel';

interface RemovePanelProps {
  customFileName: string;
  pageCount: number;
  selectedPages: number[];
  pagesInput: string;
  selectionError: string | null;
  onFileNameChange: (value: string) => void;
  onPagesInputChange: (value: string) => void;
  onTogglePage: (page: number) => void;
}

export const RemovePanel: React.FC<RemovePanelProps> = ({
  customFileName,
  pageCount,
  selectedPages,
  pagesInput,
  selectionError,
  onFileNameChange,
  onPagesInputChange,
  onTogglePage
}) => {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="remove-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Save As (Optional)
        </label>
        <input
          id="remove-name"
          type="text"
          value={customFileName}
          onChange={(e) => onFileNameChange(e.target.value)}
          placeholder="e.g. cleaned_document"
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-red-500 focus:outline-none transition-all"
        />
      </div>
      <PageSelectionPanel
        pageCount={pageCount}
        selectedPages={selectedPages}
        pagesInput={pagesInput}
        selectionError={selectionError}
        onPagesInputChange={onPagesInputChange}
        onTogglePage={onTogglePage}
        title="Remove Pages"
      />
    </div>
  );
};
