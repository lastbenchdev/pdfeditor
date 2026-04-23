import { useState } from 'react';
import {
  type EditorOperationConfig,
  isSupportedEditorToolId,
  runToolOperation
} from '../lib/pdf/operation-registry';

export type ProcessStatus = 'idle' | 'processing' | 'success' | 'error';

export function usePDFProcessor() {
  const [status, setStatus] = useState<ProcessStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const processFiles = async (toolId: string, files: File[], config: EditorOperationConfig = {}) => {
    setStatus('processing');
    setError(null);

    try {
      if (!isSupportedEditorToolId(toolId)) {
        throw new Error(`Tool ${toolId} is not yet implemented.`);
      }

      const result = await runToolOperation(toolId, files, config);

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
