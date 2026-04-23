import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = workerUrl;

interface PDFPreviewProps {
  file: File | null;
  currentPage: number;
  onPageCountChange: (count: number) => void;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ file, currentPage, onPageCountChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Track whether a render is in-flight to avoid overlapping renders
  const renderingRef = useRef(false);

  const fileKey = useMemo(() => {
    if (!file) return null;
    return `${file.name}:${file.size}:${file.lastModified}`;
  }, [file]);

  // ── Load PDF document ────────────────────────────────────────────────────
  useEffect(() => {
    let isCancelled = false;

    const loadDocument = async () => {
      if (!file) {
        setPdfDoc(null);
        onPageCountChange(0);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = getDocument({ data: arrayBuffer });
        const document = await loadingTask.promise;

        if (isCancelled) {
          await document.destroy();
          return;
        }

        setPdfDoc(document);
        onPageCountChange(document.numPages);
      } catch {
        if (!isCancelled) {
          setPdfDoc(null);
          onPageCountChange(0);
          setError('Unable to render PDF preview for this file.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadDocument();
    return () => { isCancelled = true; };
  }, [fileKey, onPageCountChange, file]);

  // ── Core render function ─────────────────────────────────────────────────
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;
    if (renderingRef.current) return; // Skip if already rendering

    // Wait one animation frame so the browser has laid out the flex container
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const containerWidth = rect.width - 48;   // 24px padding each side
    const containerHeight = rect.height - 48;

    // Guard: if the container hasn't been painted yet, retry after a frame
    if (containerWidth <= 0 || containerHeight <= 0) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const rect2 = container.getBoundingClientRect();
      if (rect2.width - 48 <= 0 || rect2.height - 48 <= 0) return;
    }

    renderingRef.current = true;
    try {
      const clampedPage = Math.min(Math.max(currentPage, 1), pdfDoc.numPages);
      const page = await pdfDoc.getPage(clampedPage);

      // Natural viewport at scale 1
      const naturalViewport = page.getViewport({ scale: 1 });

      // Re-read container dimensions (may have changed after await)
      const finalRect = container.getBoundingClientRect();
      const w = finalRect.width - 48;
      const h = finalRect.height - 48;
      if (w <= 0 || h <= 0) return;

      // Scale to fit, using device pixel ratio for sharpness
      const fitScale = Math.min(w / naturalViewport.width, h / naturalViewport.height);
      const dpr = window.devicePixelRatio || 1;
      const renderScale = fitScale * dpr;

      const viewport = page.getViewport({ scale: renderScale });

      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
      canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

      await page.render({ canvasContext: context, viewport }).promise;
    } finally {
      renderingRef.current = false;
    }
  }, [pdfDoc, currentPage]);

  // ── Trigger render when page or doc changes ──────────────────────────────
  useEffect(() => {
    let isCancelled = false;
    const doRender = async () => {
      if (!isCancelled) await renderPage();
    };
    doRender();
    return () => { isCancelled = true; };
  }, [renderPage]);

  // ── Re-render on container resize ────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || !pdfDoc) return;

    let debounceTimer: ReturnType<typeof setTimeout>;

    const resizeObserver = new ResizeObserver(() => {
      // Debounce to avoid firing on every pixel of a resize
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        renderPage();
      }, 60);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      clearTimeout(debounceTimer);
      resizeObserver.disconnect();
    };
  }, [pdfDoc, renderPage]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center p-6"
    >
      {!file && (
        <div className="text-center select-none">
          <div className="p-5 rounded-full bg-slate-200 dark:bg-slate-800 inline-flex mb-4">
            <svg
              width="32" height="32" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
              className="text-slate-400 dark:text-slate-500"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Click <strong className="text-red-500">Open File</strong> to load a PDF
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center select-none">
          <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-600 border-t-red-500 rounded-full animate-spin mb-3 mx-auto" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading PDF preview...</p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
      )}

      {!loading && !error && file && (
        <canvas
          ref={canvasRef}
          className="rounded-lg shadow-lg"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      )}
    </div>
  );
};
