import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ToolPageComponent, DownloadFile } from '../../tool-page.component';

declare var pdfjsLib: any;

@Component({
  selector: 'app-pdf-to-image',
  standalone: true,
  imports: [FormsModule, ToolPageComponent],
  templateUrl: './pdf-to-image.component.html',
  styles: []
})

export class PdfToImageComponent {
  files: File[] = [];
  downloads: DownloadFile[] = [];
  isProcessing = false;
  errorMessage = '';
  format: 'jpeg' | 'png' = 'jpeg';
  scale = '2';

  constructor() {}

  onFilesChanged(files: File[]) {
    this.files = files;
    this.errorMessage = '';
    this.downloads = [];
  }

  async onProcess() {
    if (this.files.length === 0) {
      this.errorMessage = 'Please select a PDF file.';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';
    this.downloads = [];

    try {
      // Dynamically load pdfjs-dist if not already loaded
      const pdfjs = await import('pdfjs-dist');
      // Set worker
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await this.files[0].arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const scaleNum = parseFloat(this.scale);
      const baseName = this.files[0].name.replace(/\.pdf$/i, '');
      const ext = this.format === 'png' ? 'png' : 'jpg';
      const mimeType = this.format === 'png' ? 'image/png' : 'image/jpeg';

      const results: DownloadFile[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: scaleNum });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d')!;

        // White background for JPEG
        if (this.format === 'jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        await page.render({ canvasContext: ctx, viewport }).promise;

        const dataUrl = canvas.toDataURL(mimeType, 0.92);
        const response = await fetch(dataUrl);
        const blob = await response.blob();

        const paddedPage = String(pageNum).padStart(String(pdf.numPages).length, '0');
        results.push({
          name: `${baseName}-page-${paddedPage}.${ext}`,
          blob
        });
      }

      this.downloads = results;

    } catch (error: any) {
      this.errorMessage = error.message || `Failed to convert PDF to ${this.format.toUpperCase()}.`;
      console.error(error);
    } finally {
      this.isProcessing = false;
    }
  }
}
