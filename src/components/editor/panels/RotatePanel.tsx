import React from 'react';
import { RotateCwIcon } from '../../Icons';
import { PageSelectionPanel } from '../PageSelectionPanel';

interface RotatePanelProps {
  customFileName: string;
  rotateMode: 'all' | 'selected';
  angle: number;
  pageCount: number;
  selectedPages: number[];
  pagesInput: string;
  selectionError: string | null;
  onFileNameChange: (value: string) => void;
  onRotateModeChange: (mode: 'all' | 'selected') => void;
  onAngleChange: (angle: number) => void;
  onPagesInputChange: (value: string) => void;
  onTogglePage: (page: number) => void;
}

export const RotatePanel: React.FC<RotatePanelProps> = ({
  customFileName,
  rotateMode,
  angle,
  pageCount,
  selectedPages,
  pagesInput,
  selectionError,
  onFileNameChange,
  onRotateModeChange,
  onAngleChange,
  onPagesInputChange,
  onTogglePage
}) => {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="rotate-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Save As (Optional)
        </label>
        <input
          id="rotate-name"
          type="text"
          value={customFileName}
          onChange={(e) => onFileNameChange(e.target.value)}
          placeholder="e.g. rotated_document"
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-red-500 focus:outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onRotateModeChange('all')}
          className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
            rotateMode === 'all'
              ? 'border-red-500 bg-red-50 text-red-600'
              : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          All Pages
        </button>
        <button
          type="button"
          onClick={() => onRotateModeChange('selected')}
          className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
            rotateMode === 'selected'
              ? 'border-red-500 bg-red-50 text-red-600'
              : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          Selected Pages
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[90, 180, 270].map((nextAngle) => (
          <button
            key={nextAngle}
            type="button"
            onClick={() => onAngleChange(nextAngle)}
            className={`py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
              angle === nextAngle
                ? 'border-red-500 bg-red-50 text-red-600'
                : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            <span className="inline-flex" style={{ transform: `rotate(${nextAngle}deg)` }}>
              <RotateCwIcon className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold">{nextAngle}°</span>
          </button>
        ))}
      </div>

      {rotateMode === 'selected' && (
        <PageSelectionPanel
          pageCount={pageCount}
          selectedPages={selectedPages}
          pagesInput={pagesInput}
          selectionError={selectionError}
          onPagesInputChange={onPagesInputChange}
          onTogglePage={onTogglePage}
          title="Rotate Selected Pages"
        />
      )}
    </div>
  );
};
