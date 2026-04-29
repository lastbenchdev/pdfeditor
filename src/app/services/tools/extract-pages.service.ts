import { Injectable } from '@angular/core';
import { PdfPage } from '../../models/pdf-editor.models';
import { PdfService } from '../pdf.service';

@Injectable({
  providedIn: 'root'
})
export class ExtractPagesService {

  constructor(private pdfEngine: PdfService) {}

  async process(rawBytes: Uint8Array, pages: PdfPage[]): Promise<Blob> {
    const indices = pages
      .filter(p => p.selected)
      .map(p => p.pageIndex);
      
    if (indices.length === 0) {
      throw new Error('No pages selected for extraction.');
    }

    return await this.pdfEngine.extractPages(rawBytes, indices);
  }
}
