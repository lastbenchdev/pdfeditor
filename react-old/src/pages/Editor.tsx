import React, { useEffect, useMemo, useState } from 'react';
import { DownloadIcon } from '../components/Icons';
import { EditorLayout } from '../components/editor/EditorLayout';
import { EditorToolbar } from '../components/editor/EditorToolbar';
import { FilePickerModal } from '../components/editor/FilePickerModal';
import { OperationPanelHost } from '../components/editor/OperationPanelHost';
import { PDFPreview } from '../components/editor/PDFPreview';
import { PDFThumbnails } from '../components/editor/PDFThumbnails';
import { toolsData } from '../data/tools';
import { usePDFProcessor } from '../hooks/usePDFProcessor';
import {
  isSupportedEditorToolId,
  SUPPORTED_EDITOR_TOOLS,
  type SupportedEditorToolId
} from '../lib/pdf/operation-registry';
import { buildExpressionFromPages, parsePageExpression } from '../lib/pdf/page-selection';

interface EditorProps {
  routeHash: string;
}

function getToolFromHash(routeHash: string): SupportedEditorToolId {
  const query = routeHash.includes('?') ? routeHash.split('?')[1] : '';
  const params = new URLSearchParams(query);
  const candidate = params.get('tool') || '';

  if (isSupportedEditorToolId(candidate)) {
    return candidate;
  }

  return 'merge-pdf';
}

export const Editor: React.FC<EditorProps> = ({ routeHash }) => {
  const [activeToolId, setActiveToolId] = useState<SupportedEditorToolId>(() => getToolFromHash(routeHash));
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [customFileName, setCustomFileName] = useState('');
  const [splitMode, setSplitMode] = useState<'pages' | 'ranges'>('pages');
  const [splitRanges, setSplitRanges] = useState('');
  const [rotateMode, setRotateMode] = useState<'all' | 'selected'>('all');
  const [angle, setAngle] = useState(90);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesInput, setPagesInput] = useState('');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);

  const { status, error, processFiles } = usePDFProcessor();

  const currentTool = useMemo(() => toolsData.find((tool) => tool.id === activeToolId), [activeToolId]);
  const isMultiFile = activeToolId === 'merge-pdf';
  const primaryFile = selectedFiles[0] ?? null;

  useEffect(() => {
    const nextTool = getToolFromHash(routeHash);
    setActiveToolId(nextTool);
  }, [routeHash]);

  useEffect(() => {
    if (isMultiFile) {
      return;
    }

    if (selectedFiles.length > 1) {
      setSelectedFiles([selectedFiles[0]]);
    }
  }, [isMultiFile, selectedFiles]);

  useEffect(() => {
    const nextOrder = Array.from({ length: pageCount }, (_, index) => index + 1);
    setPageOrder(nextOrder);

    if (currentPage > pageCount) {
      setCurrentPage(pageCount > 0 ? 1 : 0);
    }

    if (pageCount === 0) {
      setSelectedPages([]);
      setPagesInput('');
      setSelectionError(null);
    }
  }, [pageCount, currentPage]);

  const handleToolChange = (toolId: SupportedEditorToolId) => {
    setActiveToolId(toolId);
    window.location.hash = `#/editor?tool=${toolId}`;
  };

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

  const actionDisabled =
    status === 'processing' ||
    selectedFiles.length === 0 ||
    Boolean(selectionError) ||
    (activeToolId === 'split-pdf' && splitMode === 'ranges' && splitRanges.trim().length === 0) ||
    (activeToolId === 'rotate-pdf' && rotateMode === 'selected' && selectedPages.length === 0) ||
    ((activeToolId === 'extract-pages' || activeToolId === 'remove-pages') && selectedPages.length === 0) ||
    (activeToolId === 'organize-pdf' && pageOrder.length !== pageCount) ||
    (activeToolId === 'merge-pdf' && selectedFiles.length < 2);

  const handleProcess = async () => {
    if (!SUPPORTED_EDITOR_TOOLS.includes(activeToolId)) {
      return;
    }

    await processFiles(activeToolId, selectedFiles, {
      fileName: customFileName.trim(),
      splitMode,
      splitRanges: splitRanges.trim(),
      angle,
      rotateMode,
      pages: selectedPages,
      pageOrder
    });
  };

  return (
    <>
      <EditorLayout
        toolbar={
          <EditorToolbar
            activeToolId={activeToolId}
            onToolChange={handleToolChange}
            pageCount={pageCount}
            currentPage={currentPage || 1}
            onPageChange={setCurrentPage}
            onOpenFile={() => setIsFilePickerOpen(true)}
            hasFile={!!primaryFile}
          />
        }
        thumbnails={
          <PDFThumbnails
            file={primaryFile}
            pageCount={pageCount}
            currentPage={currentPage || 1}
            onPageSelect={setCurrentPage}
          />
        }
        preview={
          <PDFPreview
            file={primaryFile}
            currentPage={currentPage || 1}
            onPageCountChange={(count) => {
              setPageCount(count);
              setCurrentPage(count > 0 ? 1 : 0);
            }}
          />
        }
        operationPanel={
          <OperationPanelHost
            toolId={activeToolId}
            customFileName={customFileName}
            splitMode={splitMode}
            splitRanges={splitRanges}
            rotateMode={rotateMode}
            angle={angle}
            pageCount={pageCount}
            pagesInput={pagesInput}
            selectedPages={selectedPages}
            selectionError={selectionError}
            pageOrder={pageOrder}
            onFileNameChange={setCustomFileName}
            onSplitModeChange={setSplitMode}
            onSplitRangesChange={setSplitRanges}
            onRotateModeChange={setRotateMode}
            onAngleChange={setAngle}
            onPagesInputChange={handlePagesInputChange}
            onTogglePage={togglePage}
            onPageOrderChange={setPageOrder}
            fileCount={selectedFiles.length}
          />
        }
        footerActions={
          <div className="px-5 py-3 flex items-center justify-between bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3 min-w-0">
              {error ? (
                <p className="text-sm text-red-600 dark:text-red-300 truncate">{error}</p>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                  {status === 'processing'
                    ? 'Processing your PDF...'
                    : selectedFiles.length > 0
                      ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} loaded · ${currentTool?.name ?? 'Tool'} ready`
                      : 'Your files stay on your device. Processing runs locally in your browser.'}
                </p>
              )}
            </div>
            <button
              onClick={handleProcess}
              disabled={actionDisabled}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex-shrink-0"
            >
              {status === 'processing' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Run {currentTool?.name ?? 'Tool'}
                  <DownloadIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        }
      />

      <FilePickerModal
        isOpen={isFilePickerOpen}
        onClose={() => setIsFilePickerOpen(false)}
        onFilesSelected={setSelectedFiles}
        multiple={isMultiFile}
        maxFiles={isMultiFile ? 20 : 1}
      />
    </>
  );
};
