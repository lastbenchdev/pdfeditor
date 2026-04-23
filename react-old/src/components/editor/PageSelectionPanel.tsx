import React from 'react';

interface PageSelectionPanelProps {
  pageCount: number;
  selectedPages: number[];
  pagesInput: string;
  selectionError: string | null;
  onPagesInputChange: (value: string) => void;
  onTogglePage: (page: number) => void;
  thumbnailUrls?: Record<number, string>;
  helperText?: string;
  title?: string;
}

export const PageSelectionPanel: React.FC<PageSelectionPanelProps> = ({
  pageCount,
  selectedPages,
  pagesInput,
  selectionError,
  onPagesInputChange,
  onTogglePage,
  thumbnailUrls = {},
  helperText = 'Use comma-separated pages and ranges. Example: 1-3, 5, 8-10.',
  title = 'Page Selection'
}) => {
  if (pageCount === 0) return null;

  const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <label htmlFor="pageSelection" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {title}
      </label>

      {/* Text input for ranges */}
      <input
        id="pageSelection"
        type="text"
        placeholder="e.g. 1-3, 5, 8-10"
        value={pagesInput}
        onChange={(e) => onPagesInputChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-red-500 focus:outline-none transition-all text-sm placeholder:text-slate-300 dark:placeholder:text-slate-500"
      />

      <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>

      {selectionError && (
        <p className="text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded-lg">
          {selectionError}
        </p>
      )}

      {/* Thumbnail grid */}
      <div className="grid grid-cols-3 gap-2">
        {pageNumbers.map((page) => {
          const isSelected = selectedPages.includes(page);
          const thumb = thumbnailUrls[page];

          return (
            <button
              key={page}
              type="button"
              onClick={() => onTogglePage(page)}
              title={`Page ${page}`}
              className={`relative rounded-lg border-2 overflow-hidden transition-all group ${
                isSelected
                  ? 'border-red-500 ring-2 ring-red-400/40'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
              }`}
            >
              {/* Thumbnail image or placeholder */}
              <div className="aspect-[3/4] w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {thumb ? (
                  <img
                    src={thumb}
                    alt={`Page ${page}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <span className="text-[9px] text-slate-400 animate-pulse">•••</span>
                )}
              </div>

              {/* Page number badge at bottom */}
              <div
                className={`absolute bottom-0 left-0 right-0 text-center py-0.5 text-[9px] font-bold ${
                  isSelected
                    ? 'bg-red-500 text-white'
                    : 'bg-black/40 text-white/80 group-hover:bg-black/60'
                }`}
              >
                {page}
              </div>

              {/* Check overlay when selected */}
              {isSelected && (
                <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                  <div className="bg-red-500 rounded-full p-0.5">
                    <svg
                      width="10" height="10" viewBox="0 0 24 24"
                      fill="none" stroke="white" strokeWidth="3"
                      strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedPages.length > 0 && (
        <p className="text-xs font-semibold text-red-600 dark:text-red-400">
          {selectedPages.length} page{selectedPages.length > 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
};
