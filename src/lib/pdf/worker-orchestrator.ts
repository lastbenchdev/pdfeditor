/**
 * Orchestrates calls to the PDF Web Worker.
 */
let worker: Worker | null = null;
let messageId = 0;
const pendingRequests = new Map<
  number,
  {
    resolve: (value: unknown) => void;
    reject: (error: Error) => void;
  }
>();

export type SplitMode = 'pages' | 'ranges';
export type RotateMode = 'all' | 'selected';

export interface SplitConfig {
  mode?: SplitMode;
  ranges?: string;
}

export interface RotateConfig {
  mode?: RotateMode;
  pages?: number[];
}

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL('../../workers/pdf.worker.ts', import.meta.url), {
      type: 'module'
    });

    worker.onmessage = (e) => {
      const { id, status, result, error } = e.data;
      const promise = pendingRequests.get(id);
      if (promise) {
        if (status === 'success') {
          promise.resolve(result);
        } else {
          promise.reject(new Error(error));
        }
        pendingRequests.delete(id);
      }
    };
  }
  return worker;
}

function sendToWorker<T = unknown>(
  type: string,
  payload: unknown,
  transfer: Transferable[] = []
): Promise<T> {
  const id = messageId++;
  const worker = getWorker();
  
  return new Promise<T>((resolve, reject) => {
    pendingRequests.set(id, { resolve, reject });
    worker.postMessage({ id, type, payload }, transfer);
  });
}

async function getFilePayload(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  return {
    payload: {
      arrayBuffer,
      fileName: file.name
    },
    transfer: [arrayBuffer] as Transferable[]
  };
}

async function getMergePayload(files: File[]) {
  const entries = await Promise.all(
    files.map(async (file) => ({
      fileName: file.name,
      arrayBuffer: await file.arrayBuffer()
    }))
  );

  return {
    payload: { files: entries },
    transfer: entries.map((entry) => entry.arrayBuffer as Transferable)
  };
}

export const PDFWorkerApi = {
  merge: async (files: File[]) => {
    const { payload, transfer } = await getMergePayload(files);
    return sendToWorker('MERGE', payload, transfer);
  },
  split: async (file: File, config: SplitConfig = {}) => {
    const { payload, transfer } = await getFilePayload(file);
    return sendToWorker(
      'SPLIT',
      {
        ...payload,
        config: {
          mode: config.mode ?? 'pages',
          ranges: config.ranges ?? ''
        }
      },
      transfer
    );
  },
  rotate: async (file: File, angle: number, config: RotateConfig = {}) => {
    const { payload, transfer } = await getFilePayload(file);
    return sendToWorker(
      'ROTATE',
      {
        ...payload,
        angle,
        config: {
          mode: config.mode ?? 'all',
          pages: config.pages ?? []
        }
      },
      transfer
    );
  },
  removePages: async (file: File, pages: number[]) => {
    const { payload, transfer } = await getFilePayload(file);
    return sendToWorker('REMOVE_PAGES', { ...payload, pages }, transfer);
  },
  extractPages: async (file: File, pages: number[]) => {
    const { payload, transfer } = await getFilePayload(file);
    return sendToWorker('EXTRACT_PAGES', { ...payload, pages }, transfer);
  },
  organizePages: async (file: File, pageOrder: number[]) => {
    const { payload, transfer } = await getFilePayload(file);
    return sendToWorker('ORGANIZE_PAGES', { ...payload, pageOrder }, transfer);
  }
};
