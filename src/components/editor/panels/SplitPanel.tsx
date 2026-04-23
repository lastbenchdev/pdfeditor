import React from 'react';

interface SplitPanelProps {
  customFileName: string;
  splitMode: 'pages' | 'ranges';
  splitRanges: string;
  onFileNameChange: (value: string) => void;
  onSplitModeChange: (mode: 'pages' | 'ranges') => void;
  onSplitRangesChange: (value: string) => void;
}

export const SplitPanel: React.FC<SplitPanelProps> = ({
  customFileName,
  splitMode,
  splitRanges,
  onFileNameChange,
  onSplitModeChange,
  onSplitRangesChange
}) => {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="split-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Save As Prefix (Optional)
        </label>
        <input
          id="split-name"
          type="text"
          value={customFileName}
          onChange={(e) => onFileNameChange(e.target.value)}
          placeholder="e.g. chapter"
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-red-500 focus:outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSplitModeChange('pages')}
          className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
            splitMode === 'pages'
              ? 'border-red-500 bg-red-50 text-red-600'
              : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          One file per page
        </button>
        <button
          type="button"
          onClick={() => onSplitModeChange('ranges')}
          className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
            splitMode === 'ranges'
              ? 'border-red-500 bg-red-50 text-red-600'
              : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          Split by ranges
        </button>
      </div>

      {splitMode === 'ranges' && (
        <div>
          <label htmlFor="split-ranges" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Page Ranges
          </label>
          <input
            id="split-ranges"
            type="text"
            value={splitRanges}
            onChange={(e) => onSplitRangesChange(e.target.value)}
            placeholder="e.g. 1-3, 5, 8-10"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-red-500 focus:outline-none transition-all"
          />
        </div>
      )}
    </div>
  );
};
