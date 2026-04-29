import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ToolPageComponent, DownloadFile } from '../../tool-page.component';
import { MergePdfService } from '../../../../services/merge-pdf.service';

/**
 * Component for merging multiple PDF files into a single document.
 */
@Component({
  selector: 'app-merge-pdf',
  standalone: true,
  imports: [FormsModule, ToolPageComponent],
  templateUrl: './merge-pdf.component.html',
  styles: []
})
export class MergePdfComponent {
  /** Array of selected PDF files to merge. */
  files: File[] = [];
  /** Array containing the merged PDF download file. */
  downloads: DownloadFile[] = [];
  /** Indicates whether the merge process is currently active. */
  isProcessing = false;
  /** Holds any error messages generated during the process. */
  errorMessage = '';

  /** User-provided custom name for the resulting merged file. */
  customFileName = '';

  constructor(private mergeService: MergePdfService) {}

  /**
   * Updates the selected files when the user uploads or removes a file in the UI.
   * 
   * @param files The new array of selected File objects.
   */
  onFilesChanged(files: File[]) {
    this.files = files;
    this.errorMessage = '';
    this.downloads = [];
  }

  /**
   * Executes the PDF merge operation using the MergePdfService.
   * Validates that at least two files are selected before proceeding.
   */
  async onProcess() {
    if (this.files.length < 2) {
      this.errorMessage = 'Please select at least 2 PDF files to merge.';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';

    try {
      const mergedBytes = await this.mergeService.merge(this.files);
      const blob = new Blob([mergedBytes as any], { type: 'application/pdf' });
      
      let finalName = this.customFileName.trim() || 'merged-document';
      if (!finalName.toLowerCase().endsWith('.pdf')) {
        finalName += '.pdf';
      }

      this.downloads = [{
        name: finalName,
        blob: blob
      }];
    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred while merging the PDFs.';
      console.error(error);
    } finally {
      this.isProcessing = false;
    }
  }
}