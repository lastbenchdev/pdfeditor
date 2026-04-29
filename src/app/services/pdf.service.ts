import { Injectable } from '@angular/core';
import { PDFDocument, degrees } from 'pdf-lib';

/**
 * Represents a page internally within the PDF service.
 */
export interface PdfPage {
  /** The 0-based original index of the page in the raw PDF bytes. */
  pageIndex: number;
  /** The 1-based index used for displaying the page number in the UI. */
  displayNumber: number;
  /** A base64 data URL representing the rendered thumbnail of the page. */
  thumbnail: string;
  /** The physical width of the page. */
  width: number;
  /** The physical height of the page. */
  height: number;
  /** The applied rotation in degrees. Expected values: 0, 90, 180, 270. */
  rotation: number;
  /** Whether the page is marked for removal from the document. */
  deleted: boolean;
  /** Whether the page is selected for an operation (e.g., extraction). */
  selected: boolean;
}

/**
 * Represents the loaded state of a PDF document within the service.
 */
export interface PdfState {
  /** Array of pages representing the document. */
  pages: PdfPage[];
  /** Total number of pages in the document. */
  totalPages: number;
  /** The original file name of the loaded PDF. */
  fileName: string;
}

@Injectable({ providedIn: 'root' })
export class PdfService {

  /** 
   * Loads a PDF file from a browser File object, renders all page thumbnails using pdf.js,
   * and returns the initialized PdfState alongside the raw bytes of the document.
   * 
   * @param file The PDF File object to load.
   * @param thumbnailWidth The desired width of the generated thumbnails in pixels.
   * @returns A promise resolving to an object containing the parsed state and raw byte array.
   */
  async loadPdf(file: File, thumbnailWidth = 200): Promise<{ state: PdfState; rawBytes: Uint8Array }> {
    const rawBytes = new Uint8Array(await file.arrayBuffer());

    // Load with pdf-lib to get page dimensions
    const pdfDoc = await PDFDocument.load(rawBytes as unknown as Uint8Array, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();

    // Load with pdf.js for rendering
    const pdfjsLib = await this.getPdfjsLib();
    const loadingTask = pdfjsLib.getDocument({ data: rawBytes.slice(0) });
    const pdfJsDoc = await loadingTask.promise;

    const pages: PdfPage[] = [];

    for (let i = 0; i < pageCount; i++) {
      const thumbnail = await this.renderPageThumbnail(pdfJsDoc, i + 1, thumbnailWidth);
      const pdfLibPage = pdfDoc.getPage(i);
      const { width, height } = pdfLibPage.getSize();

      pages.push({
        pageIndex: i,
        displayNumber: i + 1,
        thumbnail,
        width,
        height,
        rotation: 0,
        deleted: false,
        selected: false,
      });
    }

    return {
      state: {
        pages,
        totalPages: pageCount,
        fileName: file.name,
      },
      rawBytes,
    };
  }

  /** Renders a single page from a loaded pdfjs document to a base64 JPEG. */
  private async renderPageThumbnail(pdfJsDoc: any, pageNum: number, targetWidth: number): Promise<string> {
    const page = await pdfJsDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1 });
    const scale = targetWidth / viewport.width;
    const scaledViewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(scaledViewport.width);
    canvas.height = Math.round(scaledViewport.height);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;
    return canvas.toDataURL('image/jpeg', 0.82);
  }

  /** Lazy-loads pdfjs-dist with the correct worker setup. */
  private pdfjsLibCache: any = null;
  private async getPdfjsLib(): Promise<any> {
    if (this.pdfjsLibCache) return this.pdfjsLibCache;
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    this.pdfjsLibCache = pdfjsLib;
    return pdfjsLib;
  }

  // ─── Internal helpers ────────────────────────────────────────────────────────

  private async loadDoc(rawBytes: Uint8Array) {
    return PDFDocument.load(rawBytes as unknown as Uint8Array);
  }

  private toBlob(saved: Uint8Array): Blob {
    // Use the underlying ArrayBuffer to create a Blob
    return new Blob([new Uint8Array(saved)], { type: 'application/pdf' });
  }

  // ─── Output Operations ──────────────────────────────────────────────────────

  /** 
   * Removes pages from the PDF document based on their original indices.
   * 
   * @param rawBytes The original raw bytes of the PDF document.
   * @param indicesToRemove An array of 0-based page indices to remove.
   * @returns A promise resolving to a Blob containing the modified PDF document.
   */
  async removePages(rawBytes: Uint8Array, indicesToRemove: number[]): Promise<Blob> {
    const pdfDoc = await this.loadDoc(rawBytes);
    const toRemove = new Set(indicesToRemove);
    const pageCount = pdfDoc.getPageCount();
    for (let i = pageCount - 1; i >= 0; i--) {
      if (toRemove.has(i)) pdfDoc.removePage(i);
    }
    return this.toBlob(await pdfDoc.save());
  }

  /** 
   * Extracts specific pages from the PDF document and creates a new PDF containing only those pages.
   * 
   * @param rawBytes The original raw bytes of the PDF document.
   * @param indices An array of 0-based page indices to extract.
   * @returns A promise resolving to a Blob containing the new, extracted PDF document.
   */
  async extractPages(rawBytes: Uint8Array, indices: number[]): Promise<Blob> {
    const srcDoc = await this.loadDoc(rawBytes);
    const newDoc = await PDFDocument.create();
    const copied = await newDoc.copyPages(srcDoc, indices);
    copied.forEach(p => newDoc.addPage(p));
    return this.toBlob(await newDoc.save());
  }

  /** 
   * Applies rotations to specific pages within the PDF document.
   * 
   * @param rawBytes The original raw bytes of the PDF document.
   * @param rotations An array of objects specifying the 0-based pageIndex and the rotation angle to apply.
   * @returns A promise resolving to a Blob containing the rotated PDF document.
   */
  async rotatePages(rawBytes: Uint8Array, rotations: { pageIndex: number; rotation: number }[]): Promise<Blob> {
    const pdfDoc = await this.loadDoc(rawBytes);
    for (const { pageIndex, rotation } of rotations) {
      const page = pdfDoc.getPage(pageIndex);
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + rotation) % 360));
    }
    return this.toBlob(await pdfDoc.save());
  }

  /** 
   * Reorders pages in the PDF document according to a new sequence.
   * 
   * @param rawBytes The original raw bytes of the PDF document.
   * @param newOrder An array of 0-based original page indices in their desired new order.
   * @returns A promise resolving to a Blob containing the reordered PDF document.
   */
  async reorderPages(rawBytes: Uint8Array, newOrder: number[]): Promise<Blob> {
    const srcDoc = await this.loadDoc(rawBytes);
    const newDoc = await PDFDocument.create();
    const copied = await newDoc.copyPages(srcDoc, newOrder);
    copied.forEach(p => newDoc.addPage(p));
    return this.toBlob(await newDoc.save());
  }

  /**
   * Splits a PDF document into multiple separate documents based on provided split points.
   * 
   * @param rawBytes The original raw bytes of the PDF document.
   * @param splitAfter An array of 0-based page indices after which to split the document.
   * @param totalPages The total number of pages in the original document.
   * @returns A promise resolving to an array of Blobs, each representing a split section of the PDF.
   */
  async splitPdf(rawBytes: Uint8Array, splitAfter: number[], totalPages: number): Promise<Blob[]> {
    const srcDoc = await this.loadDoc(rawBytes);
    const blobs: Blob[] = [];

    const ranges: [number, number][] = [];
    let start = 0;
    const sorted = [...splitAfter].sort((a, b) => a - b);
    for (const sp of sorted) {
      ranges.push([start, sp]);
      start = sp + 1;
    }
    ranges.push([start, totalPages - 1]);

    for (const [from, to] of ranges) {
      if (from > to) continue;
      const newDoc = await PDFDocument.create();
      const indices = Array.from({ length: to - from + 1 }, (_, i) => from + i);
      const copied = await newDoc.copyPages(srcDoc, indices);
      copied.forEach(p => newDoc.addPage(p));
      blobs.push(this.toBlob(await newDoc.save()));
    }

    return blobs;
  }

  /** 
   * Helper utility to trigger a browser download of a generated Blob.
   * 
   * @param blob The Blob object to download.
   * @param filename The name of the file to be saved on the user's system.
   */
  downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}
