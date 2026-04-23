import React from 'react';
import { Reorder } from 'framer-motion';

interface OrganizePanelProps {
  customFileName: string;
  pageOrder: number[];
  onFileNameChange: (value: string) => void;
  onPageOrderChange: (order: number[]) => void;
}

export const OrganizePanel: React.FC<OrganizePanelProps> = ({
  customFileName,
  pageOrder,
  onFileNameChange,
  onPageOrderChange
}) => {
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="organize-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Save As (Optional)
        </label>
        <input
          id="organize-name"
          type="text"
          value={customFileName}
          onChange={(e) => onFileNameChange(e.target.value)}
          placeholder="e.g. organized_document"
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-red-500 focus:outline-none transition-all"
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Drag to reorder pages</p>
        <Reorder.Group axis="y" values={pageOrder} onReorder={onPageOrderChange} className="space-y-2 max-h-80 overflow-auto pr-1">
          {pageOrder.map((page) => (
            <Reorder.Item
              key={page}
              value={page}
              className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 cursor-grab active:cursor-grabbing"
            >
              <span className="font-semibold text-slate-700 dark:text-slate-200">Page {page}</span>
              <span className="text-xs text-slate-400">Drag</span>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
};
