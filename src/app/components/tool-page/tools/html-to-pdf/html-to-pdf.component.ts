import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-html-to-pdf',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './html-to-pdf.component.html',
  styles: []
})
export class HtmlToPdfComponent {
  htmlContent = '';
  pageSize = 'A4';
  orientation = 'portrait';
  errorMessage = '';

  convertToPdf() {
    if (!this.htmlContent.trim()) {
      this.errorMessage = 'Please enter some HTML content.';
      return;
    }
    this.errorMessage = '';

    const pageSizes: Record<string, string> = {
      'A4':     'size: A4',
      'Letter': 'size: letter',
      'Legal':  'size: legal',
    };
    const sizeCSS = pageSizes[this.pageSize] || 'size: A4';

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      this.errorMessage = 'Popup blocked! Please allow popups for this site and try again.';
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>PDF Export</title>
  <style>
    @page { ${sizeCSS}; ${this.orientation === 'landscape' ? 'size: ' + this.pageSize + ' landscape;' : ''} margin: 15mm; }
    * { box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 12pt; line-height: 1.6; color: #000; background: #fff; margin: 0; padding: 0; }
    img { max-width: 100%; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 6px 10px; }
  </style>
</head>
<body>
\${this.htmlContent}
<script>window.onload = function() { window.print(); };<\/script>
</body>
</html>`);
    printWindow.document.close();
  }
}
