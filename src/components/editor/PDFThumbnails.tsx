import React, { useEffect, useMemo, useState } from 'react';
import { getDocument, type PDFDocumentProxy } from 'pdfjs-dist';

interface PDFThumbnailsProps {
  file: File | null;
  pageCount: number;
  currentPage: number;
  onPageSelect: (page: number) => void;
  onThumbnailsReady?: (urls: Record<number, string>) => void;
}

export const PDFThumbnails: React.FC<PDFThumbnailsProps> = ({
  file,
  pageCount,
  currentPage,
  onPageSelect,
  onThumbnailsReady,
}) => {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<number, string>>({});

  const fileKey = useMemo(() => {
    if (!file) return null;
    return `${file.name}:${file.size}:${file.lastModified}`;
  }, [file]);

  useEffect(() => {
    let isCancelled = false;

    const loadDoc = async () => {
      if (!file) {
        setPdfDoc(null);
        setThumbnailUrls({});
        return;
      }

      const arrayBuffer = await file.arrayBuffer();
      const task = getDocument({ data: arrayBuffer });
      const document = await task.promise;

      if (isCancelled) {
        await document.destroy();
        return;
      }

      setPdfDoc(document);
      setThumbnailUrls({});
    };

    loadDoc().catch(() => {
      if (!isCancelled) {
        setPdfDoc(null);
        setThumbnailUrls({});
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [fileKey, file]);

  useEffect(() => {
    let isCancelled = false;

    const renderThumbnails = async () => {
      if (!pdfDoc || pageCount === 0) return;

      const next: Record<number, string> = {};
      const limit = Math.min(pageCount, 50);

      for (let pageNum = 1; pageNum <= limit; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: 0.25 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context || isCancelled) return;

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        await page.render({ canvasContext: context, viewport }).promise;
        next[pageNum] = canvas.toDataURL('image/png');

        // Publish incrementally so PageSelectionPanel shows thumbnails as they render
        if (!isCancelled) {
          setThumbnailUrls((prev) => ({ ...prev, [pageNum]: next[pageNum] }));
        }
      }

      if (!isCancelled) {
        onThumbnailsReady?.(next);
      }
    };

    renderThumbnails().catch(() => {
      if (!isCancelled) setThumbnailUrls({});
    });

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, pageCount, onThumbnailsReady]);

  if (!file || pageCount === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4 bg-white dark:bg-slate-900">
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          Thumbnails appear after opening a PDF.
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2 bg-white dark:bg-slate-900">
      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 px-1">
        Pages
      </p>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNum) => {
        const isActive = pageNum === currentPage;
        const thumbnail = thumbnailUrls[pageNum];

        return (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageSelect(pageNum)}
            className={`w-full rounded-lg border p-1.5 text-left transition-all ${
              isActive
                ? 'border-red-500 bg-red-50 dark:bg-red-900/30 ring-1 ring-red-500/30'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="aspect-[3/4] rounded overflow-hidden bg-slate-100 dark:bg-slate-800 mb-1 flex items-center justify-center">
              {thumbnail ? (
                <img src={thumbnail} alt={`Page ${pageNum}`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[9px] text-slate-400">...</span>
              )}
            </div>
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 text-center">{pageNum}</p>
          </button>
        );
      })}
    </div>
  );
};
