import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PDFDocument } from 'pdf-lib';
import { ToolPageComponent, DownloadFile } from '../../tool-page.component';

@Component({
  selector: 'app-image-to-pdf',
  standalone: true,
  imports: [FormsModule, RouterModule, ToolPageComponent],
  templateUrl: './image-to-pdf.component.html',
  styles: []
})

export class ImageToPdfComponent {
  files: File[] = [];
  downloads: DownloadFile[] = [];
  isProcessing = false;
  errorMessage = '';
  customFileName = '';
  pageSize = 'fit';
  margin = 0;

  onFilesChanged(files: File[]) {
    this.files = files;
    this.errorMessage = '';
    this.downloads = [];
  }

  async onProcess() {
    if (this.files.length === 0) {
      this.errorMessage = 'Please select at least one image file.';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';

    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of this.files) {
        const imgBytes = await file.arrayBuffer();
        const mime = file.type.toLowerCase();
        let img;

        if (mime === 'image/png') {
          img = await pdfDoc.embedPng(imgBytes);
        } else {
          // Default: try JPEG embedding
          img = await pdfDoc.embedJpg(imgBytes);
        }

        const marginPx = Number(this.margin) || 0;

        let pageWidth: number, pageHeight: number;
        if (this.pageSize === 'A4') {
          pageWidth = 595; pageHeight = 842;
        } else if (this.pageSize === 'Letter') {
          pageWidth = 612; pageHeight = 792;
        } else {
          // Fit to image
          pageWidth = img.width + marginPx * 2;
          pageHeight = img.height + marginPx * 2;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Scale image to fit within page margins
        const maxW = pageWidth - marginPx * 2;
        const maxH = pageHeight - marginPx * 2;
        const scale = Math.min(maxW / img.width, maxH / img.height, 1);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const x = (pageWidth - drawW) / 2;
        const y = (pageHeight - drawH) / 2;

        page.drawImage(img, { x, y, width: drawW, height: drawH });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });

      let finalName = this.customFileName.trim() || 'images';
      if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

      this.downloads = [{ name: finalName, blob }];
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to convert images to PDF.';
      console.error(error);
    } finally {
      this.isProcessing = false;
    }
  }
}
