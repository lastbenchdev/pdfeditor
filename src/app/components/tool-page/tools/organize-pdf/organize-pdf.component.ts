import { Component, ElementRef, ViewChild } from '@angular/core';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PdfPageGalleryComponent } from '../../../shared/pdf-page-gallery/pdf-page-gallery.component';
import { PdfService, PdfPage, PdfState } from '../../../../services/pdf.service';

@Component({
  selector: 'app-organize-pdf',
  standalone: true,
  imports: [RouterModule, FormsModule, PdfPageGalleryComponent],
  styleUrls: ['../shared-tool.css'],
  template: `
<div class="page-shell">

  <!-- Top bar -->
  <div class="top-bar">
    <div class="top-bar-left">
      <a routerLink="/tools" class="back-link">
        <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        All Tools
      </a>
      <div class="top-divider"></div>
      <div class="tool-badge">
        <div class="badge-icon-wrap" style="background:rgba(139,92,246,.12);color:#a78bfa">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </div>
        <span class="tool-name">Organize PDF</span>
      </div>
    </div>
    <div class="top-bar-right">
      <button class="process-btn" [disabled]="!pdfState || isProcessing" (click)="process()" type="button">
        @if (!isProcessing) {
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        }
        @if (isProcessing) {
          <svg class="btn-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
        }
        {{ isProcessing ? 'Saving…' : 'Save Order' }}
      </button>
    </div>
  </div>

  <!-- Content -->
  <div class="content-area">

    <!-- Upload zone -->
    @if (!pdfState && !isLoading) {
      <div
        class="upload-zone"
        [class.drag-over]="isDragging"
        (dragover)="onDragOver($event)" (dragleave)="isDragging=false" (drop)="onDrop($event)"
        (click)="fileInput.click()">
        <input #fileInput type="file" accept=".pdf" class="hidden-input" (change)="onFileSelect($event)">
        <div class="upload-icon-ring">
          <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 16 12 12 8 16"></polyline>
            <line x1="12" y1="12" x2="12" y2="21"></line>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
          </svg>
        </div>
        <p class="upload-title">Drop your PDF here or click to browse</p>
        <p class="upload-hint">Drag & drop pages to rearrange them · Processed in your browser</p>
      </div>
    }

    <!-- File bar -->
    @if (pdfState && !isLoading) {
      <div class="file-bar">
        <div class="file-bar-left">
          <div class="file-icon-wrap">
            <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
          </div>
          <div>
            <div class="file-info-name">{{ pdfState.fileName }}</div>
            <div class="file-info-size">{{ pdfState.totalPages }} pages</div>
          </div>
        </div>
        <button class="change-btn" (click)="fileInput.click()" type="button">Change file</button>
        <input #fileInput type="file" accept=".pdf" class="hidden-input" (change)="onFileSelect($event)">
      </div>
    }

    <!-- Hint -->
    @if (pdfState && !isLoading) {
      <div class="settings-panel">
        <div class="settings-title">Page Order</div>
        <p style="font-size:.85rem;color:var(--text-muted);font-weight:500;line-height:1.6">
          Drag pages by the <strong style="color:var(--text-main)">⠿ handle</strong> that appears on hover to reorder them.
          When satisfied with the order, click <strong style="color:var(--text-main)">Save Order</strong> to download the reordered PDF.
        </p>
      </div>
    }

    <!-- Error -->
    @if (errorMessage) {
      <div class="error-bar">
        <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        {{ errorMessage }}
      </div>
    }

    <!-- Gallery -->
    <app-pdf-page-gallery
      [pages]="pages"
      mode="organize"
      [isLoading]="isLoading"
      [skeletonCount]="8"
      (pagesChanged)="onPagesChanged($event)"
    ></app-pdf-page-gallery>

    <!-- Download -->
    @if (downloadBlob) {
      <div class="download-panel">
        <div class="download-header">
          <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Done! Your organized PDF is ready.
        </div>
        <div class="download-list">
          <div class="download-item">
            <span class="dl-name">{{ downloadName }}</span>
            <button class="dl-btn" (click)="download()" type="button">
              <svg class="dl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>
    }

  </div>
</div>
`
})
/**
 * Component providing an interactive gallery to rearrange the order of pages within a PDF.
 */
export class OrganizePdfComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  /** The state of the currently loaded PDF document. */
  pdfState: PdfState | null = null;
  /** The raw byte array of the original loaded PDF. */
  rawBytes: Uint8Array | null = null;
  /** Array of pages representing the current state of the document in the UI. */
  pages: PdfPage[] = [];
  /** Indicates whether a PDF file is currently being loaded and parsed. */
  isLoading = false;
  /** Indicates whether the organize operation is currently being processed. */
  isProcessing = false;
  /** Tracks if a file is being dragged over the upload zone. */
  isDragging = false;
  /** Holds any error messages generated during loading or processing. */
  errorMessage = '';
  /** The resulting reordered PDF Blob ready for download. */
  downloadBlob: Blob | null = null;
  /** The default file name for the downloaded PDF. */
  downloadName = '';

  constructor(private pdf: PdfService) {}

  /** Handles the dragover event on the upload zone. */
  onDragOver(e: DragEvent) { e.preventDefault(); this.isDragging = true; }
  
  /** Handles the drop event on the upload zone, loading the dropped file. */
  onDrop(e: DragEvent) {
    e.preventDefault(); this.isDragging = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) this.loadFile(file);
  }
  
  /** Handles the file selection event from the hidden input element. */
  onFileSelect(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) { this.loadFile(file); (e.target as HTMLInputElement).value = ''; }
  }

  /**
   * Reads and parses a PDF file using the PdfService, initializing the component state.
   * 
   * @param file The browser File object representing the PDF.
   */
  async loadFile(file: File) {
    this.isLoading = true; this.errorMessage = ''; this.downloadBlob = null;
    try {
      const { state, rawBytes } = await this.pdf.loadPdf(file);
      this.pdfState = state; this.rawBytes = rawBytes; this.pages = state.pages;
    } catch (err: any) { this.errorMessage = err.message || 'Failed to load PDF.'; }
    finally { this.isLoading = false; }
  }

  /**
   * Callback invoked when the user interacts with the gallery to modify pages (e.g., drag and drop to reorder).
   * 
   * @param updated The updated array of PdfPage objects from the gallery.
   */
  onPagesChanged(updated: PdfPage[]) {
    this.pages = updated; this.downloadBlob = null;
  }

  /**
   * Executes the PDF organize operation by sending the newly ordered pages to the PdfService.
   */
  async process() {
    if (!this.rawBytes || !this.pdfState) return;
    // The pages array now holds pages in the new desired order
    const newOrder = this.pages.map(p => p.pageIndex);
    this.isProcessing = true; this.errorMessage = '';
    try {
      this.downloadBlob = await this.pdf.reorderPages(this.rawBytes, newOrder);
      const base = this.pdfState.fileName.replace(/\.pdf$/i, '');
      this.downloadName = `${base}-organized.pdf`;
    } catch (err: any) { this.errorMessage = err.message || 'Failed to reorder pages.'; }
    finally { this.isProcessing = false; }
  }

  /**
   * Triggers the browser download of the processed PDF Blob.
   */
  download() {
    if (this.downloadBlob) this.pdf.downloadBlob(this.downloadBlob, this.downloadName);
  }
}
