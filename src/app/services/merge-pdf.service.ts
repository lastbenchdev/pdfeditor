import { Injectable } from '@angular/core';
import { PDFDocument } from 'pdf-lib';

/**
 * Service responsible for merging multiple PDF documents into a single file.
 */
@Injectable({ providedIn: 'root' })
export class MergePdfService {
  /**
   * Merges an array of PDF File objects into a single PDF document.
   * The files are merged in the order they are provided in the array.
   * 
   * @param files An array of browser File objects representing the PDFs to merge.
   * @returns A promise resolving to a Uint8Array containing the merged PDF document bytes.
   */
  async merge(files: File[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(bytes);
      const copied = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
      copied.forEach(p => mergedPdf.addPage(p));
    }
    return await mergedPdf.save();
  }
}
