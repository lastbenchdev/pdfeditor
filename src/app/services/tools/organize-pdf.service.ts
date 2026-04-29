import { Injectable } from '@angular/core';
import { PdfPage } from '../../models/pdf-editor.models';
import { PdfService } from '../pdf.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizePdfService {

  constructor(private pdfEngine: PdfService) {}

  /**
   * Applies the reordered state to the raw PDF bytes.
   * @param rawBytes Original PDF bytes
   * @param pages The current state of pages in the UI (in the new order)
   * @returns A Blob representing the processed PDF
   */
  async process(rawBytes: Uint8Array, pages: PdfPage[]): Promise<Blob> {
    // The 'pages' array is assumed to be sorted in the user's desired order.
    // We map this to an array of original 0-based page indices.
    const newOrder = pages.map(p => p.pageIndex);
    
    // Quick check: did the order actually change?
    const isUnchanged = newOrder.every((val, idx) => val === idx);
    if (isUnchanged) {
      return new Blob([rawBytes as any], { type: 'application/pdf' });
    }

    return await this.pdfEngine.reorderPages(rawBytes, newOrder);
  }
}
