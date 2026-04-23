import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Reorder } from 'framer-motion';
import { toolsData } from '../data/tools';
import { FilePicker } from '../components/tool/FilePicker';
import { usePDFProcessor } from '../hooks/usePDFProcessor';
import { DownloadIcon, WrenchIcon, RotateCwIcon } from '../components/Icons';

interface ToolDetailProps {
  toolId: string;
}

function buildPageSequence(pageCount: number): number[] {
  return Array.from({ length: pageCount }, (_, index) => index + 1);
}

function buildExpressionFromPages(pages: number[]): string {
  if (pages.length === 0) return '';

  const sorted = [...pages].sort((a, b) => a - b);
  const chunks: string[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
      continue;
    }

    chunks.push(start === end ? `${start}` : `${start}-${end}`);
    start = sorted[i];
    end = sorted[i];
  }

  chunks.push(start === end ? `${start}` : `${start}-${end}`);
  return chunks.join(', ');
}

function parsePageExpression(expression: string, pageCount: number): { pages: number[]; error: string | null } {
  const trimmed = expression.trim();
  if (!trimmed) {
    return { pages: [], error: null };
  }

  const chunks = trimmed
    .split(',')
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  if (chunks.length === 0) {
    return { pages: [], error: 'Enter at least one page or range.' };
  }

  const pages: number[] = [];
  const seen = new Set<number>();

  for (const chunk of chunks) {
    const rangeMatch = chunk.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      if (start < 1 || end < 1 || start > pageCount || end > pageCount || start > end) {
        return { pages: [], error: `Range ${chunk} is invalid for a ${pageCount}-page PDF.` };
      }

      for (let page = start; page <= end; page++) {
        if (!seen.has(page)) {
          seen.add(page);
          pages.push(page);
        }
      }
      continue;
    }

    if (/^\d+$/.test(chunk)) {
      const page = Number(chunk);
      if (page < 1 || page > pageCount) {
        return { pages: [], error: `Page ${page} is out of bounds for this PDF.` };
      }

      if (!seen.has(page)) {
        seen.add(page);
        pages.push(page);
      }
      continue;
    }

    return { pages: [], error: `Could not parse ${chunk}. Use format like 1-3, 5, 8-10.` };
  }

  return { pages, error: null };
}

export const ToolDetail: React.FC<ToolDetailProps> = ({ toolId }) => {
  const editorFileInputRef = useRef<HTMLInputElement>(null);
  const tool = useMemo(() => toolsData.find((t) => t.id === toolId), [toolId]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [customFileName, setCustomFileName] = useState('');
  const { status, error, processFiles } = usePDFProcessor();
  const [rotation, setRotation] = useState(90);
  const [rotateMode, setRotateMode] = useState<'all' | 'selected'>('all');
  const [splitMode, setSplitMode] = useState<'pages' | 'ranges'>('pages');
  const [splitRanges, setSplitRanges] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [pagesInput, setPagesInput] = useState('');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [pageMetaLoading, setPageMetaLoading] = useState(false);
  const [pageMetaError, setPageMetaError] = useState<string | null>(null);

  const showRotation = toolId === 'rotate-pdf';
  const showSplit = toolId === 'split-pdf';
  const showRemove = toolId === 'remove-pages';
  const showExtract = toolId === 'extract-pages';
  const showOrganize = toolId === 'organize-pdf';
  const showMergeWorkspace = toolId === 'merge-pdf';
  const isMultiFile = toolId === 'merge-pdf';
  const isEditorTool = showRotation || showRemove || showExtract || showOrganize;
  const showEditorLayout = isEditorTool && selectedFiles.length > 0;

  const needsPageMetadata = isEditorTool;
  const needsPageSelection = showRemove || showExtract || (showRotation && rotateMode === 'selected');

  const splitConfigInvalid = showSplit && splitMode === 'ranges' && splitRanges.trim().length === 0;
  const pageSelectionInvalid = needsPageSelection && selectedPages.length === 0;
  const organizeInvalid = showOrganize && pageOrder.length !== pageCount;
  const pageNumbers = useMemo(() => buildPageSequence(pageCount), [pageCount]);

  useEffect(() => {
    const firstFile = selectedFiles[0];

    if (!needsPageMetadata || !firstFile) {
      return;
    }

    let isCancelled = false;

    const loadPageMetadata = async () => {
      setPageMetaLoading(true);
      setPageMetaError(null);
      try {
        const arrayBuffer = await firstFile.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        if (isCancelled) return;

        const count = pdf.getPageCount();
        setPageCount(count);
        setPageOrder(buildPageSequence(count));
        setPagesInput('');
        setSelectedPages([]);
        setSelectionError(null);
      } catch {
        if (isCancelled) return;
        setPageCount(0);
        setPageOrder([]);
        setPageMetaError('Unable to read page details from this PDF. Please try another file.');
      } finally {
        if (!isCancelled) {
          setPageMetaLoading(false);
        }
      }
    };

    loadPageMetadata();

    return () => {
      isCancelled = true;
    };
  }, [needsPageMetadata, selectedFiles]);

  const handlePagesInputChange = (value: string) => {
    setPagesInput(value);

    if (pageCount === 0) {
      setSelectedPages([]);
      setSelectionError(null);
      return;
    }

    const parsed = parsePageExpression(value, pageCount);
    setSelectionError(parsed.error);
    if (!parsed.error) {
      setSelectedPages(parsed.pages);
    }
  };

  const togglePage = (page: number) => {
    const current = new Set(selectedPages);
    if (current.has(page)) {
      current.delete(page);
    } else {
      current.add(page);
    }

    const next = Array.from(current).sort((a, b) => a - b);
    setSelectedPages(next);
    setPagesInput(buildExpressionFromPages(next));
    setSelectionError(null);
  };

  const handleReplaceEditorFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;

    if (nextFile.type !== 'application/pdf') {
      alert('Please select a PDF file.');
      return;
    }

    setSelectedFiles([nextFile]);
    event.target.value = '';
  };

  const actionDisabled =
    selectedFiles.length === 0 ||
    splitConfigInvalid ||
    pageSelectionInvalid ||
    organizeInvalid ||
    Boolean(selectionError) ||
    pageMetaLoading;

  const handleProcess = async () => {
    if (selectedFiles.length === 0) return;

    await processFiles(toolId, selectedFiles, {
      angle: rotation,
      rotateMode,
      pages: selectedPages,
      fileName: customFileName.trim(),
      splitMode,
      splitRanges: splitRanges.trim(),
      pageOrder
    });
  };

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500 dark:text-slate-400">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tool not found</h2>
        <p>The PDF tool you are looking for does not exist.</p>
        <a href="#/" className="mt-4 text-red-600 hover:underline">Return Home</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-start gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 shadow-sm">
            <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 rounded-xl shrink-0">
              {tool.icon}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{tool.name}</h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{tool.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-black/20 p-8 sm:p-12 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
          {status !== 'processing' ? (
            <>
              {!showEditorLayout && (
                <FilePicker
                  onFilesSelected={setSelectedFiles}
                  multiple={isMultiFile}
                  maxFiles={isMultiFile ? 20 : 1}
                />
              )}

              {selectedFiles.length > 0 && (
                <div className="mt-12 w-full border-t border-slate-50 dark:border-slate-800 pt-10">
                  {showEditorLayout ? (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 px-4 py-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Editing File</p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[340px]">{selectedFiles[0].name}</p>
                        </div>
                        <div>
                          <input
                            ref={editorFileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleReplaceEditorFile}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => editorFileInputRef.current?.click()}
                            className="px-4 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-600 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-all"
                          >
                            Choose Another PDF
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-[330px_1fr] gap-6">
                        <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              {showOrganize ? 'Page Order' : 'Page Preview'}
                            </h4>
                            {pageCount > 0 && <span className="text-xs text-slate-400 dark:text-slate-500">{pageCount} pages</span>}
                          </div>

                          {pageMetaLoading && <p className="text-sm text-slate-500 dark:text-slate-400">Loading page list...</p>}
                          {pageMetaError && <p className="text-sm text-red-600">{pageMetaError}</p>}

                          {showOrganize && pageCount > 0 && (
                            <Reorder.Group axis="y" values={pageOrder} onReorder={setPageOrder} className="space-y-3 max-h-[560px] overflow-auto pr-1">
                              {pageOrder.map((page) => (
                                <Reorder.Item
                                  key={page}
                                  value={page}
                                  className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl shadow-sm cursor-grab active:cursor-grabbing"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-12 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Page {page}</span>
                                  </div>
                                  <span className="text-xs text-slate-400 dark:text-slate-500">Drag</span>
                                </Reorder.Item>
                              ))}
                            </Reorder.Group>
                          )}

                          {!showOrganize && pageCount > 0 && (
                            <div className="grid grid-cols-2 gap-3 max-h-[560px] overflow-auto pr-1">
                              {pageNumbers.map((page) => {
                                const isSelected = selectedPages.includes(page);
                                return (
                                  <button
                                    key={page}
                                    type="button"
                                    onClick={() => togglePage(page)}
                                    className={`rounded-xl border-2 p-3 text-left transition-all ${
                                      isSelected
                                        ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
                                        : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                  >
                                    <div className="aspect-[3/4] rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-2" />
                                    <p className={`text-xs font-semibold ${isSelected ? 'text-red-700 dark:text-red-300' : 'text-slate-600 dark:text-slate-300'}`}>
                                      Page {page}
                                    </p>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <div className="rounded-2xl border border-slate-100 dark:border-slate-700 p-6 bg-white dark:bg-slate-900">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="col-span-full md:col-span-1">
                              <label htmlFor="filename" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                                Save As (Optional)
                              </label>
                              <input
                                id="filename"
                                type="text"
                                placeholder="e.g. final_report"
                                value={customFileName}
                                onChange={(e) => setCustomFileName(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-red-500 focus:outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-500"
                              />
                            </div>

                            {showRotation && (
                              <div className="col-span-full md:col-span-1 space-y-4">
                                <div>
                                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Rotate Scope</label>
                                  <div className="grid grid-cols-2 gap-3">
                                    <button
                                      type="button"
                                      onClick={() => setRotateMode('all')}
                                      className={`py-3 px-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                                        rotateMode === 'all'
                                          ? 'border-red-500 bg-red-50 text-red-600 shadow-sm'
                                            : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-200 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                                      }`}
                                    >
                                      All Pages
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setRotateMode('selected')}
                                      className={`py-3 px-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                                        rotateMode === 'selected'
                                          ? 'border-red-500 bg-red-50 text-red-600 shadow-sm'
                                            : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-200 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                                      }`}
                                    >
                                      Selected Pages
                                    </button>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Rotation Angle</label>
                                  <div className="grid grid-cols-3 gap-3">
                                    {[90, 180, 270].map((angle) => (
                                      <button
                                        key={angle}
                                        onClick={() => setRotation(angle)}
                                        className={`py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                                          rotation === angle
                                            ? 'border-red-500 bg-red-50 text-red-600 shadow-sm'
                                            : 'border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:border-slate-200 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                      >
                                        <span className="inline-flex transition-transform duration-500" style={{ transform: `rotate(${angle}deg)` }}>
                                          <RotateCwIcon className="w-4 h-4" />
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-tight">{angle}°</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {needsPageSelection && pageCount > 0 && (
                            <div className="mb-6">
                              <label htmlFor="pageSelection" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                                Page Numbers
                              </label>
                              <input
                                id="pageSelection"
                                type="text"
                                placeholder="e.g. 1-3, 5, 8-10"
                                value={pagesInput}
                                onChange={(e) => handlePagesInputChange(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-red-500 focus:outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-500"
                              />
                              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                Pick single pages, ranges, or mixed sequences like 1-2, 5, 7-9.
                              </p>
                            </div>
                          )}

                          {selectionError && (
                            <p className="mb-4 text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 px-4 py-2 rounded-lg">{selectionError}</p>
                          )}

                          <button
                            onClick={handleProcess}
                            disabled={actionDisabled}
                            className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 bg-red-600 rounded-2xl hover:bg-red-700 hover:shadow-lg hover:shadow-red-200 focus:outline-none overflow-hidden"
                          >
                            <span className="relative flex items-center gap-3 text-lg">
                              {tool.name} Now
                              <DownloadIcon className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                            </span>
                          </button>

                          {pageSelectionInvalid && (
                            <p className="mt-4 text-amber-700 dark:text-amber-300 text-sm font-medium bg-amber-50 dark:bg-amber-900/30 px-4 py-2 rounded-lg">
                              Select at least one page before running this tool.
                            </p>
                          )}

                          {organizeInvalid && (
                            <p className="mt-4 text-amber-700 dark:text-amber-300 text-sm font-medium bg-amber-50 dark:bg-amber-900/30 px-4 py-2 rounded-lg">
                              Reorder list is incomplete. Please keep all pages in the list.
                            </p>
                          )}

                          {error && (
                            <p className="mt-4 text-red-500 dark:text-red-300 text-sm font-medium bg-red-50 dark:bg-red-900/30 px-4 py-2 rounded-lg">{error}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : showMergeWorkspace ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Merge Setup</h3>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="filename" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                              Save As (Optional)
                            </label>
                            <input
                              id="filename"
                              type="text"
                              placeholder="e.g. unified_document"
                              value={customFileName}
                              onChange={(e) => setCustomFileName(e.target.value)}
                              className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-red-500 focus:outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-500"
                            />
                          </div>
                          <button
                            onClick={handleProcess}
                            disabled={actionDisabled}
                            className="w-full group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 bg-red-600 rounded-2xl hover:bg-red-700 hover:shadow-lg hover:shadow-red-200 focus:outline-none overflow-hidden"
                          >
                            <span className="relative flex items-center gap-3 text-lg">
                              {tool.name} Now
                              <DownloadIcon className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-100 dark:border-slate-700 p-6 bg-white dark:bg-slate-900">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Merge Summary</h3>
                        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                          <p>
                            <span className="font-semibold text-slate-900 dark:text-white">Files selected:</span> {selectedFiles.length}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-900 dark:text-white">Order:</span> Top to bottom from your file list.
                          </p>
                          <p className="text-slate-500 dark:text-slate-400">
                            Drag files in the list above to rearrange the final merged PDF order before processing.
                          </p>
                        </div>
                        {error && (
                          <p className="mt-4 text-red-500 dark:text-red-300 text-sm font-medium bg-red-50 dark:bg-red-900/30 px-4 py-2 rounded-lg">{error}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-center">
                      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="col-span-full md:col-span-1">
                          <label htmlFor="filename" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                            Save As (Optional)
                          </label>
                          <input
                            id="filename"
                            type="text"
                            placeholder="e.g. final_report"
                            value={customFileName}
                            onChange={(e) => setCustomFileName(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-red-500 focus:outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-500"
                          />
                        </div>

                        {showSplit && (
                          <div className="col-span-full space-y-4">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Split Mode</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => setSplitMode('pages')}
                                className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                                  splitMode === 'pages'
                                    ? 'border-red-500 bg-red-50 text-red-600 shadow-sm'
                                    : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-200 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                              >
                                One file per page
                              </button>
                              <button
                                type="button"
                                onClick={() => setSplitMode('ranges')}
                                className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                                  splitMode === 'ranges'
                                    ? 'border-red-500 bg-red-50 text-red-600 shadow-sm'
                                    : 'border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-200 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                              >
                                Split by ranges
                              </button>
                            </div>

                            {splitMode === 'ranges' && (
                              <div>
                                <label htmlFor="splitRanges" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                                  Page Ranges
                                </label>
                                <input
                                  id="splitRanges"
                                  type="text"
                                  placeholder="e.g. 1-3, 5, 8-10"
                                  value={splitRanges}
                                  onChange={(e) => setSplitRanges(e.target.value)}
                                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-red-500 focus:outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-500"
                                />
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                  Use comma-separated pages and ranges. Example: 1-3, 5, 8-10.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleProcess}
                        disabled={actionDisabled}
                        className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 bg-red-600 rounded-2xl hover:bg-red-700 hover:shadow-lg hover:shadow-red-200 focus:outline-none overflow-hidden"
                      >
                        <span className="relative flex items-center gap-3 text-lg">
                          {tool.name} Now
                          <DownloadIcon className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                        </span>
                      </button>

                      {splitConfigInvalid && (
                        <p className="mt-4 text-amber-700 dark:text-amber-300 text-sm font-medium bg-amber-50 dark:bg-amber-900/30 px-4 py-2 rounded-lg">
                          Enter page ranges before starting split by ranges.
                        </p>
                      )}

                      {error && (
                        <p className="mt-4 text-red-500 dark:text-red-300 text-sm font-medium bg-red-50 dark:bg-red-900/30 px-4 py-2 rounded-lg">{error}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-20 flex flex-col items-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-red-50 dark:border-red-900/40 border-t-red-600 dark:border-t-red-400 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-red-600">
                  <WrenchIcon className="w-8 h-8 animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Processing your PDF...</h3>
              <p className="text-slate-500 dark:text-slate-400">This will only take a moment. Your files never leave your device.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};