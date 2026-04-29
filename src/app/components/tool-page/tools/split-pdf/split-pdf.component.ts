import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolPageComponent, DownloadFile } from '../../tool-page.component';
import { PdfService } from '../../../../services/pdf.service';

/**
 * Component for splitting a PDF document into multiple smaller documents based on an interval.
 */
export interface SplitGroup {
  range: string;
  name: string;
}

@Component({
  selector: 'app-split-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule, ToolPageComponent],
  templateUrl: './split-pdf.component.html',
  styles: []
})
export class SplitPdfComponent {
  /** Array of selected PDF files to split. */
  files: File[] = [];
  /** The resulting split PDF files ready for download. */
  downloads: DownloadFile[] = [];
  /** Indicates if the split operation is currently running. */
  isProcessing = false;
  /** Stores any error message encountered during the process. */
  errorMessage = '';

  /** Split mode: 'interval', 'individual', or 'custom' */
  splitMode: 'interval' | 'individual' | 'custom' = 'interval';
  /** Optional prefix for the output filenames (for interval/individual modes). */
  outputPrefix = '';
  /** The number of pages each split document should contain. */
  splitInterval = 1;

  /** List of custom split groups (for custom mode). */
  customSplits: SplitGroup[] = [{ range: '', name: '' }];

  /** Map of file names to their total page counts. */
  filePageCounts: Record<string, number> = {};

  constructor(private pdf: PdfService) {}

  /**
   * Handles file selection changes from the tool page.
   */
  async onFilesChanged(files: File[]) {
    this.files = files;
    this.errorMessage = '';
    this.downloads = [];
    
    // Reset and load page counts
    this.filePageCounts = {};
    for (const file of files) {
      try {
        const { state } = await this.pdf.loadPdf(file);
        this.filePageCounts[file.name] = state.totalPages;
      } catch (e) {
        console.error('Failed to load page count for', file.name, e);
      }
    }
  }

  /** Adds a new empty split group. */
  addSplitGroup() {
    this.customSplits.push({ range: '', name: '' });
  }

  /** Removes a split group by index. */
  removeSplitGroup(index: number) {
    if (this.customSplits.length > 1) {
      this.customSplits.splice(index, 1);
    }
  }

  /**
   * Parses a range string (e.g., "1-5, 8, 10-12") into an array of 0-based page indices.
   */
  private parseRange(rangeStr: string, maxPages: number): number[] {
    const indices: number[] = [];
    const parts = rangeStr.split(/[,;]/);

    for (let part of parts) {
      part = part.trim();
      if (!part) continue;

      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr.trim());
        const end = parseInt(endStr.trim());

        if (!isNaN(start) && !isNaN(end)) {
          const s = Math.max(1, Math.min(start, maxPages));
          const e = Math.max(1, Math.min(end, maxPages));
          const min = Math.min(s, e);
          const max = Math.max(s, e);
          for (let i = min; i <= max; i++) {
            indices.push(i - 1);
          }
        }
      } else {
        const num = parseInt(part);
        if (!isNaN(num)) {
          const n = Math.max(1, Math.min(num, maxPages));
          indices.push(n - 1);
        }
      }
    }

    return [...new Set(indices)].sort((a, b) => a - b);
  }

  /**
   * Initiates the split process for all selected files.
   */
  async onProcess() {
    if (this.files.length === 0) {
      this.errorMessage = 'Please select at least one PDF file to split.';
      return;
    }

    if (this.splitMode === 'interval' && this.splitInterval < 1) {
      this.errorMessage = 'Split interval must be at least 1 page.';
      return;
    }

    if (this.splitMode === 'custom') {
      const hasEmptyRange = this.customSplits.some(s => !s.range.trim());
      if (hasEmptyRange) {
        this.errorMessage = 'Please provide a range for all split groups.';
        return;
      }
    }

    this.isProcessing = true;
    this.errorMessage = '';
    this.downloads = [];

    const allDownloads: DownloadFile[] = [];

    try {
      for (const file of this.files) {
        const { state, rawBytes } = await this.pdf.loadPdf(file);
        const totalPages = state.totalPages;
        const baseName = file.name.replace(/\.pdf$/i, '');
        const globalPrefix = this.outputPrefix.trim() || baseName;

        if (this.splitMode === 'custom') {
          // Custom Range Mode
          for (const group of this.customSplits) {
            const indices = this.parseRange(group.range, totalPages);
            if (indices.length === 0) continue;

            const blob = await this.pdf.extractPages(rawBytes, indices);
            const fileName = group.name.trim() 
              ? (group.name.toLowerCase().endsWith('.pdf') ? group.name : `${group.name}.pdf`)
              : `${globalPrefix}-${group.range.replace(/\s+/g, '')}.pdf`;

            allDownloads.push({ name: fileName, blob });
          }
        } else {
          // Interval or Individual Modes
          let splitAfter: number[] = [];

          if (this.splitMode === 'individual') {
            for (let i = 0; i < totalPages - 1; i++) splitAfter.push(i);
          } else {
            for (let i = this.splitInterval - 1; i < totalPages - 1; i += this.splitInterval) {
              splitAfter.push(i);
            }
          }

          if (splitAfter.length === 0) {
            if (this.files.length === 1) {
              this.errorMessage = 'Nothing to split for this document.';
              this.isProcessing = false;
              return;
            }
            allDownloads.push({ name: `${globalPrefix}.pdf`, blob: new Blob([rawBytes as any], { type: 'application/pdf' }) });
            continue;
          }

          const blobs = await this.pdf.splitPdf(rawBytes, splitAfter, totalPages);
          blobs.forEach((b, i) => {
            allDownloads.push({
              name: `${globalPrefix}-part-${i + 1}.pdf`,
              blob: b
            });
          });
        }
      }

      this.downloads = allDownloads;
      
    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred while splitting the PDF.';
      console.error(error);
    } finally {
      this.isProcessing = false;
    }
  }
}
