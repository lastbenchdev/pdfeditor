import { Injectable } from '@angular/core';
import { PdfPage } from '../../models/pdf-editor.models';
import { PdfService } from '../pdf.service';

@Injectable({
  providedIn: 'root'
})
export class RotatePdfService {

  constructor(private pdfEngine: PdfService) {}

  async process(rawBytes: Uint8Array, pages: PdfPage[]): Promise<Blob> {
    const rotations = pages
      .filter(p => p.rotation !== 0)
      .map(p => ({ pageIndex: p.pageIndex, rotation: p.rotation }));
      
    if (rotations.length === 0) {
      return new Blob([rawBytes as any], { type: 'application/pdf' });
    }

    return await this.pdfEngine.rotatePages(rawBytes, rotations);
  }
}
