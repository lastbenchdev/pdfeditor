import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { PdfService } from '../../services/pdf.service';
import { ViewMode, WorkspaceState, PdfDocument } from '../../models/pdf-editor.models';

import { PdfPageGalleryComponent } from '../shared/pdf-page-gallery/pdf-page-gallery.component';

import { RemovePagesService } from '../../services/tools/remove-pages.service';
import { OrganizePdfService } from '../../services/tools/organize-pdf.service';
import { RotatePdfService } from '../../services/tools/rotate-pdf.service';
import { ExtractPagesService } from '../../services/tools/extract-pages.service';

@Component({
  selector: 'app-pdf-workspace',
  standalone: true,
  imports: [CommonModule, RouterModule, PdfPageGalleryComponent],
  templateUrl: './pdf-workspace.component.html',
  styleUrls: ['./pdf-workspace.component.css']
})
export class PdfWorkspaceComponent implements OnInit {
  
  state: WorkspaceState = {
    activeDocument: null,
    pages: [],
    viewMode: 'gallery',
    activeTool: '',
    isLoading: false
  };

  isDragging = false;

  constructor(
    private route: ActivatedRoute,
    private storage: StorageService,
    private pdfEngine: PdfService,
    private removeService: RemovePagesService,
    private organizeService: OrganizePdfService,
    private rotateService: RotatePdfService,
    private extractService: ExtractPagesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const tool = params.get('tool');
      if (tool) {
        this.state.activeTool = tool;
      }
    });
  }

  // --- View Toggles ---
  setViewMode(mode: ViewMode) {
    this.state.viewMode = mode;
  }

  // --- File Upload ---
  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(e: DragEvent) {
    this.isDragging = false;
  }

  async onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) {
      await this.handleFileUpload(file);
    }
  }

  async onFileSelect(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      await this.handleFileUpload(file);
    }
  }

  private async handleFileUpload(file: File) {
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file.');
      return;
    }

    this.state.isLoading = true;
    
    try {
      // 1. Generate unique ID for this session
      const docId = crypto.randomUUID();
      
      // 2. Extract raw bytes
      const rawBytes = new Uint8Array(await file.arrayBuffer());
      
      // 3. Save directly to IndexedDB
      await this.storage.saveWorkingCopy(docId, rawBytes);
      
      // 4. Generate thumbnails and state via Engine
      const result = await this.pdfEngine.loadPdf(file);
      
      this.state.activeDocument = {
        id: docId,
        fileName: file.name,
        fileSize: file.size,
        totalPages: result.state.totalPages
      };
      
      this.state.pages = result.state.pages;

    } catch (err) {
      console.error('Failed to load PDF:', err);
      alert('Failed to load the PDF. Please try another file.');
    } finally {
      this.state.isLoading = false;
    }
  }

  // --- Gallery Interaction ---
  onPagesChanged(pages: any[]) {
    this.state.pages = pages;
  }

  // --- Download & Clean Up ---
  async exportDocument() {
    if (!this.state.activeDocument) return;
    
    this.state.isLoading = true;
    try {
      // 1. Get the original raw bytes from IndexedDB
      const rawBytes = await this.storage.getWorkingCopy(this.state.activeDocument.id);
      if (!rawBytes) throw new Error('Working copy lost from storage.');
      
      // 2. Process the bytes through the active tool's service
      let finalBlob: Blob;
      
      switch (this.state.activeTool) {
        case 'remove':
          finalBlob = await this.removeService.process(rawBytes, this.state.pages);
          break;
        case 'organize':
          finalBlob = await this.organizeService.process(rawBytes, this.state.pages);
          break;
        case 'rotate':
          finalBlob = await this.rotateService.process(rawBytes, this.state.pages);
          break;
        case 'extract':
          finalBlob = await this.extractService.process(rawBytes, this.state.pages);
          break;
        default:
          // If no tool logic or just simple save
          finalBlob = new Blob([rawBytes as any], { type: 'application/pdf' });
      }
      
      // 3. Trigger download
      const newName = `${this.state.activeTool || 'edited'}-${this.state.activeDocument.fileName}`;
      this.pdfEngine.downloadBlob(finalBlob, newName);
      
      // 4. (Optional) Clear storage if the user is completely done. 
      // For now, we keep it in case they want to make more changes.
      
    } catch (err: any) {
      console.error('Export failed:', err);
      alert(err.message || 'Export failed.');
    } finally {
      this.state.isLoading = false;
    }
  }
}
