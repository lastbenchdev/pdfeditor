import {
  Component, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener
} from '@angular/core';

import { RouterModule } from '@angular/router';
import { ICONS } from '../../data/icons';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

export interface DownloadFile {
  name: string;
  blob: Blob;
}

@Component({
  selector: 'app-tool-page',
  standalone: true,
  imports: [RouterModule, SafeHtmlPipe],
  template: `
    <div class="tool-page">
    
      <!-- Page Header -->
      <div class="tool-header animate-fade-up">
        <a routerLink="/tools" class="back-btn">
          <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          All Tools
        </a>
        <div class="tool-meta">
          <div class="tool-icon-box" [style.background]="iconBg" [style.color]="iconColor">
            <svg class="tool-hero-icon" [attr.viewBox]="getIconData(icon).viewBox" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="getIconData(icon).path | safeHtml"></svg>
          </div>
          <div>
            <h1 class="tool-title">{{ title }}</h1>
            <p class="tool-subtitle">{{ description }}</p>
          </div>
        </div>
      </div>
    
      <!-- Upload Zone -->
      <div class="upload-zone animate-fade-up"
        [class.drag-over]="isDragging"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave()"
        (drop)="onDrop($event)"
        (click)="fileInput.click()">
        <input #fileInput type="file" class="hidden-input"
          [accept]="acceptedTypes"
          [multiple]="allowMultiple"
          (change)="onFileSelect($event)">
    
        @if (selectedFiles.length === 0) {
          <div class="upload-empty">
            <div class="upload-icon-wrap">
              <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 16 12 12 8 16"></polyline>
                <line x1="12" y1="12" x2="12" y2="21"></line>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
              </svg>
            </div>
            <p class="upload-title">Drop files here or click to browse</p>
            <p class="upload-hint">{{ uploadHint }}</p>
          </div>
        }
    
        @if (selectedFiles.length > 0) {
          <div class="file-list" (click)="$event.stopPropagation()">
            <div class="file-list-header">
              <span class="file-count">{{ selectedFiles.length }} file{{ selectedFiles.length !== 1 ? 's' : '' }} selected</span>
              <button class="add-more-btn" (click)="fileInput.click()">+ Add more</button>
            </div>
            @for (f of selectedFiles; track f; let i = $index) {
              <div class="file-item">
                <div class="file-info">
                  <svg class="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                  <div>
                    <span class="file-name">{{ f.name }}</span>
                    <span class="file-size">{{ formatSize(f.size) }}</span>
                  </div>
                </div>
                <div class="file-actions">
                  @if (allowMultiple && selectedFiles.length > 1) {
                    <button class="move-btn" [disabled]="i === 0" (click)="moveFileUp(i)">▲</button>
                  }
                  @if (allowMultiple && selectedFiles.length > 1) {
                    <button class="move-btn" [disabled]="i === selectedFiles.length - 1" (click)="moveFileDown(i)">▼</button>
                  }
                  <button class="remove-btn" (click)="removeFile(i)">
                    <svg class="remove-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    
      <!-- Settings Slot (tool-specific options) -->
      @if (selectedFiles.length > 0) {
        <div class="settings-panel animate-fade-up">
          <ng-content select="[slot=settings]"></ng-content>
        </div>
      }
    
      <!-- Process Button -->
      @if (selectedFiles.length > 0) {
        <div class="action-row animate-fade-up">
          <button class="process-btn" [disabled]="isProcessing" (click)="onProcess()">
            @if (!isProcessing) {
              <span>
                <svg class="btn-icon" [attr.viewBox]="getIconData(actionIcon).viewBox" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="getIconData(actionIcon).path | safeHtml"></svg>
                {{ actionLabel }}
              </span>
            }
            @if (isProcessing) {
              <span class="processing-state">
                <svg class="btn-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
                Processing…
              </span>
            }
          </button>
        </div>
      }
    
      <!-- Error -->
      @if (errorMessage) {
        <div class="error-box animate-fade-up">
          <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          {{ errorMessage }}
        </div>
      }
    
      <!-- Downloads -->
      @if (downloadFiles.length > 0) {
        <div class="download-area animate-fade-up">
          <div class="download-header">
            <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Done! Your {{ downloadFiles.length > 1 ? 'files are' : 'file is' }} ready.</span>
          </div>
          <div class="download-list">
            @for (df of downloadFiles; track df) {
              <div class="download-item">
                <span class="dl-name">{{ df.name }}</span>
                <button class="dl-btn" (click)="$event.stopPropagation(); download(df)">
                  <svg class="dl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download
                </button>
              </div>
            }
          </div>
          <div class="dl-actions">
            @if (downloadFiles.length > 1) {
              <button class="dl-zip-btn" (click)="downloadAsZip()" [disabled]="isZipping">
                @if (!isZipping) {
                  <svg class="dl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
                  </svg>
                }
                @if (isZipping) {
                  <svg class="dl-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                }
                {{ isZipping ? 'Creating ZIP...' : 'Download as ZIP' }}
              </button>
            }
            @if (downloadFiles.length > 1) {
              <button class="dl-all-btn" (click)="downloadAll()">
                <svg class="dl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download All
              </button>
            }
          </div>
        </div>
      }
    
    </div>
    `,
  styleUrls: ['./tool-page.component.css']
})
export class ToolPageComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() icon: string = 'file';
  @Input() iconBg: string = 'rgba(99, 102, 241, 0.1)';
  @Input() iconColor: string = 'var(--color-primary)';
  @Input() acceptedTypes: string = '.pdf';
  @Input() allowMultiple: boolean = false;
  @Input() uploadHint: string = 'PDF files supported';
  @Input() actionLabel: string = 'Process';
  @Input() actionIcon: string = 'settings';
  @Input() isProcessing: boolean = false;
  @Input() errorMessage: string = '';
  @Input() downloadFiles: DownloadFile[] = [];
  @Input() selectedFiles: File[] = [];

  getIconData(name: string) {
    return ICONS[name] || ICONS['file'];
  }

  @Output() filesChanged = new EventEmitter<File[]>();
  @Output() process = new EventEmitter<void>();

  isDragging = false;

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragging = true;
  }
  onDragLeave() { this.isDragging = false; }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
    const files = Array.from(e.dataTransfer?.files ?? []);
    this.addFiles(files);
  }

  onFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    this.addFiles(files);
    input.value = '';
  }

  addFiles(files: File[]) {
    if (this.allowMultiple) {
      this.filesChanged.emit([...this.selectedFiles, ...files]);
    } else {
      this.filesChanged.emit(files.slice(0, 1));
    }
  }

  removeFile(index: number) {
    const updated = [...this.selectedFiles];
    updated.splice(index, 1);
    this.filesChanged.emit(updated);
  }

  moveFileUp(index: number) {
    if (index > 0) {
      const updated = [...this.selectedFiles];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      this.filesChanged.emit(updated);
    }
  }

  moveFileDown(index: number) {
    if (index < this.selectedFiles.length - 1) {
      const updated = [...this.selectedFiles];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      this.filesChanged.emit(updated);
    }
  }

  onProcess() {
    this.process.emit();
  }

  download(df: DownloadFile) {
    const url = URL.createObjectURL(df.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = df.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  downloadAll() {
    this.downloadFiles.forEach((df, i) => {
      setTimeout(() => this.download(df), i * 200);
    });
  }

  isZipping = false;
  async downloadAsZip() {
    this.isZipping = true;
    try {
      // Dynamically load JSZip from CDN
      const scriptId = 'jszip-cdn';
      if (!document.getElementById(scriptId)) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.id = scriptId;
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      const JSZip = (window as any).JSZip;
      const zip = new JSZip();
      
      this.downloadFiles.forEach(file => {
        zip.file(file.name, file.blob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipName = this.title.toLowerCase().replace(/\s+/g, '-') + '-results.zip';
      
      this.download({
        name: zipName,
        blob: zipBlob
      });
    } catch (error) {
      console.error('ZIP generation failed:', error);
      alert('Failed to generate ZIP. Please try individual downloads.');
    } finally {
      this.isZipping = false;
    }
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}
