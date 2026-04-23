import { PDFWorkerApi } from './worker-orchestrator';

export const SUPPORTED_EDITOR_TOOLS = [
  'merge-pdf',
  'split-pdf',
  'rotate-pdf',
  'remove-pages',
  'extract-pages',
  'organize-pdf'
] as const;

export type SupportedEditorToolId = (typeof SUPPORTED_EDITOR_TOOLS)[number];

export interface EditorOperationConfig {
  fileName?: string;
  splitMode?: 'pages' | 'ranges';
  splitRanges?: string;
  angle?: number;
  rotateMode?: 'all' | 'selected';
  pages?: number[];
  pageOrder?: number[];
}

interface PDFResult {
  blob: Blob;
  name: string;
}

type OperationOutput = PDFResult | PDFResult[];

type OperationRunner = (files: File[], config: EditorOperationConfig) => Promise<OperationOutput>;

type OperationValidator = (files: File[], config: EditorOperationConfig) => string | null;

interface ToolOperation {
  run: OperationRunner;
  validate?: OperationValidator;
}

function applyCustomName(result: OperationOutput, customName?: string): OperationOutput {
  if (!customName?.trim()) {
    return result;
  }

  const base = customName.trim();
  const pdfName = base.endsWith('.pdf') ? base : `${base}.pdf`;

  if (Array.isArray(result)) {
    return result.map((item, index) => ({
      ...item,
      name: `${base}_page_${index + 1}.pdf`
    }));
  }

  return {
    ...result,
    name: pdfName
  };
}

const operations: Record<SupportedEditorToolId, ToolOperation> = {
  'merge-pdf': {
    validate: (files) => (files.length < 2 ? 'Select at least 2 PDF files to merge.' : null),
    run: async (files, config) => {
      const result = (await PDFWorkerApi.merge(files)) as PDFResult;
      return applyCustomName(result, config.fileName);
    }
  },
  'split-pdf': {
    validate: (files, config) => {
      if (files.length !== 1) return 'Select one PDF file to split.';
      if (config.splitMode === 'ranges' && !config.splitRanges?.trim()) {
        return 'Enter page ranges before splitting by ranges.';
      }
      return null;
    },
    run: async (files, config) => {
      const result = (await PDFWorkerApi.split(files[0], {
        mode: config.splitMode ?? 'pages',
        ranges: config.splitRanges ?? ''
      })) as PDFResult[];
      return applyCustomName(result, config.fileName);
    }
  },
  'rotate-pdf': {
    validate: (files, config) => {
      if (files.length !== 1) return 'Select one PDF file to rotate.';
      if (config.rotateMode === 'selected' && (!config.pages || config.pages.length === 0)) {
        return 'Select at least one page to rotate.';
      }
      return null;
    },
    run: async (files, config) => {
      const result = (await PDFWorkerApi.rotate(files[0], config.angle ?? 90, {
        mode: config.rotateMode ?? 'all',
        pages: config.pages ?? []
      })) as PDFResult;
      return applyCustomName(result, config.fileName);
    }
  },
  'remove-pages': {
    validate: (files, config) => {
      if (files.length !== 1) return 'Select one PDF file to remove pages from.';
      if (!config.pages || config.pages.length === 0) return 'Select at least one page to remove.';
      return null;
    },
    run: async (files, config) => {
      const result = (await PDFWorkerApi.removePages(files[0], config.pages ?? [])) as PDFResult;
      return applyCustomName(result, config.fileName);
    }
  },
  'extract-pages': {
    validate: (files, config) => {
      if (files.length !== 1) return 'Select one PDF file to extract pages from.';
      if (!config.pages || config.pages.length === 0) return 'Select at least one page to extract.';
      return null;
    },
    run: async (files, config) => {
      const result = (await PDFWorkerApi.extractPages(files[0], config.pages ?? [])) as PDFResult;
      return applyCustomName(result, config.fileName);
    }
  },
  'organize-pdf': {
    validate: (files, config) => {
      if (files.length !== 1) return 'Select one PDF file to organize.';
      if (!config.pageOrder || config.pageOrder.length === 0) return 'Reorder pages before continuing.';
      return null;
    },
    run: async (files, config) => {
      const result = (await PDFWorkerApi.organizePages(files[0], config.pageOrder ?? [])) as PDFResult;
      return applyCustomName(result, config.fileName);
    }
  }
};

export function isSupportedEditorToolId(toolId: string): toolId is SupportedEditorToolId {
  return SUPPORTED_EDITOR_TOOLS.includes(toolId as SupportedEditorToolId);
}

export async function runToolOperation(
  toolId: SupportedEditorToolId,
  files: File[],
  config: EditorOperationConfig
): Promise<OperationOutput> {
  const operation = operations[toolId];
  const validationError = operation.validate?.(files, config);

  if (validationError) {
    throw new Error(validationError);
  }

  return operation.run(files, config);
}
