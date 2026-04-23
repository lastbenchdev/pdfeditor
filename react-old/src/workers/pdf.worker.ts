import {
  extractPages,
  mergePDFs,
  organizePages,
  removePages,
  rotatePDF,
  splitPDF
} from '../lib/pdf/pdf-engine';

/**
 * Web Worker for handling PDF operations in a background thread.
 */
self.onmessage = async (e: MessageEvent) => {
  const { type, payload, id } = e.data;

  try {
    let result;
    switch (type) {
      case 'MERGE':
        result = await mergePDFs(payload.files);
        break;
      case 'SPLIT':
        result = await splitPDF(payload.arrayBuffer, payload.fileName, payload.config);
        break;
      case 'ROTATE':
        result = await rotatePDF(payload.arrayBuffer, payload.fileName, payload.angle, payload.config);
        break;
      case 'REMOVE_PAGES':
        result = await removePages(payload.arrayBuffer, payload.fileName, payload.pages);
        break;
      case 'EXTRACT_PAGES':
        result = await extractPages(payload.arrayBuffer, payload.fileName, payload.pages);
        break;
      case 'ORGANIZE_PAGES':
        result = await organizePages(payload.arrayBuffer, payload.fileName, payload.pageOrder);
        break;
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }

    self.postMessage({ id, status: 'success', result });
  } catch (error: any) {
    self.postMessage({ id, status: 'error', error: error.message });
  }
};
