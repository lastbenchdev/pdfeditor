import { Injectable } from '@angular/core';
import { PdfPage } from '../../models/pdf-editor.models';
import { PdfService } from '../pdf.service';

@Injectable({
  providedIn: 'root'
})
export class RemovePagesService {

  constructor(private pdfEngine: PdfService) {}

  /**
   * Applies the soft-deletion state to the raw PDF bytes.
   * @param rawBytes Original PDF bytes
   * @param pages The current state of pages in the UI
   * @returns A Blob representing the processed PDF
   */
  async process(rawBytes: Uint8Array, pages: PdfPage[]): Promise<Blob> {
    // Collect the original 0-based indices of all pages marked as deleted
    const indicesToRemove = pages
      .filter(p => p.deleted)
      .map(p => p.pageIndex);
    
    // If no pages were removed, just return the original file
    if (indicesToRemove.length === 0) {
      return new Blob([rawBytes as any], { type: 'application/pdf' });
    }

    return await this.pdfEngine.removePages(rawBytes, indicesToRemove);
  }
}
