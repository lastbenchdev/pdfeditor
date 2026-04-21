import { useState } from 'react';
import { PDFWorkerApi } from '../lib/pdf/worker-orchestrator';

export type ProcessStatus = 'idle' | 'processing' | 'success' | 'error';

export function usePDFProcessor() {
  const [status, setStatus] = useState<ProcessStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const processFiles = async (toolId: string, files: File[], config: any = {}) => {
    setStatus('processing');
    setError(null);

    const customName = config.fileName || '';

    try {
      let result;
      switch (toolId) {
        case 'merge-pdf':
          result = await PDFWorkerApi.merge(files);
          if (customName) result.name = customName.endsWith('.pdf') ? customName : `${customName}.pdf`;
          break;
        case 'rotate-pdf':
          result = await PDFWorkerApi.rotate(files[0], config.angle || 90, {
            mode: config.rotateMode || 'all',
            pages: config.pages || []
          });
          if (customName) result.name = customName.endsWith('.pdf') ? customName : `${customName}.pdf`;
          break;
        case 'split-pdf':
          result = await PDFWorkerApi.split(files[0], {
            mode: config.splitMode || 'pages',
            ranges: config.splitRanges || ''
          });
          if (customName) {
            result.forEach((r: any, i: number) => {
              r.name = `${customName}_page_${i + 1}.pdf`;
            });
          }
          break;
        case 'remove-pages':
          result = await PDFWorkerApi.removePages(files[0], config.pages || []);
          if (customName) result.name = customName.endsWith('.pdf') ? customName : `${customName}.pdf`;
          break;
        case 'extract-pages':
          result = await PDFWorkerApi.extractPages(files[0], config.pages || []);
          if (customName) result.name = customName.endsWith('.pdf') ? customName : `${customName}.pdf`;
          break;
        case 'organize-pdf':
          result = await PDFWorkerApi.organizePages(files[0], config.pageOrder || []);
          if (customName) result.name = customName.endsWith('.pdf') ? customName : `${customName}.pdf`;
          break;
        // Add more tools as they are implemented
        default:
          throw new Error(`Tool ${toolId} is not yet implemented.`);
      }

      setStatus('success');
      
      // Auto-download result(s)
      if (Array.isArray(result)) {
        result.forEach(r => downloadBlob(r.blob, r.name));
      } else {
        downloadBlob(result.blob, result.name);
      }
      
      return result;
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setError(err.message || 'An error occurred during processing.');
    }
  };

  return { status, error, processFiles, setStatus };
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
