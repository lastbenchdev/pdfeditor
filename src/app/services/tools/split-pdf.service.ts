import { Injectable } from '@angular/core';
import { PdfPage } from '../../models/pdf-editor.models';
import { PdfService } from '../pdf.service';

@Injectable({
  providedIn: 'root'
})
export class SplitPdfService {

  constructor(private pdfEngine: PdfService) {}

  /**
   * Generates a ZIP file containing multiple split PDFs.
   * @param rawBytes Original PDF bytes
   * @param pages The current state of pages in the UI (which contain selected split points)
   * @returns A Blob representing the ZIP file
   */
  async process(rawBytes: Uint8Array, pages: PdfPage[]): Promise<Blob> {
    const splitIndices = pages
      .filter(p => p.selected) // assuming 'selected' acts as the scissors marker in the UI
      .map(p => p.pageIndex);
      
    if (splitIndices.length === 0) {
      // If no splits defined, just return the original
      return new Blob([rawBytes as any], { type: 'application/pdf' });
    }

    return await this.pdfEngine.splitPdf(rawBytes, splitIndices);
  }
}
