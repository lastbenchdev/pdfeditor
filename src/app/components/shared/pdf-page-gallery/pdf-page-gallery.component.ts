import {
  Component, Input, Output, EventEmitter, OnChanges, SimpleChanges
} from '@angular/core';

import { PdfPage } from '../../../services/pdf.service';

export type GalleryMode = 'view' | 'remove' | 'extract' | 'rotate' | 'organize' | 'split';

@Component({
  selector: 'app-pdf-page-gallery',
  standalone: true,
  imports: [],
  templateUrl: './pdf-page-gallery.component.html',
  styleUrls: ['./pdf-page-gallery.component.css'],
})
export class PdfPageGalleryComponent implements OnChanges {
  @Input() pages: PdfPage[] = [];
  @Input() mode: GalleryMode = 'view';
  @Input() isLoading = false;
  @Input() skeletonCount = 6;

  // Split mode
  @Input() splitPoints: Set<number> = new Set(); // page indices AFTER which to split

  @Output() pagesChanged = new EventEmitter<PdfPage[]>();
  @Output() splitPointsChanged = new EventEmitter<Set<number>>();

  // Drag state
  dragSourceIndex: number | null = null;
  dragOverIndex: number | null = null;

  ngOnChanges(changes: SimpleChanges) {
    // nothing needed — parent drives state
  }

  get skeletonItems(): number[] {
    return Array.from({ length: this.skeletonCount }, (_, i) => i);
  }

  get selectedCount(): number {
    return this.pages.filter(p => p.selected).length;
  }

  get deletedCount(): number {
    return this.pages.filter(p => p.deleted).length;
  }

  // ─── Card click ──────────────────────────────────────────────────────
  onCardClick(page: PdfPage) {
    if (this.mode === 'remove') {
      this.toggleDelete(page);
    } else if (this.mode === 'extract') {
      this.toggleSelect(page);
    }
  }

  // ─── Remove / Restore ─────────────────────────────────────────────
  toggleDelete(page: PdfPage) {
    const updated = this.pages.map(p =>
      p.pageIndex === page.pageIndex ? { ...p, deleted: !p.deleted } : p
    );
    this.pagesChanged.emit(updated);
  }

  restoreAll() {
    const updated = this.pages.map(p => ({ ...p, deleted: false }));
    this.pagesChanged.emit(updated);
  }

  deleteAll() {
    const updated = this.pages.map(p => ({ ...p, deleted: true }));
    this.pagesChanged.emit(updated);
  }

  // ─── Selection (extract) ──────────────────────────────────────────
  toggleSelect(page: PdfPage) {
    const updated = this.pages.map(p =>
      p.pageIndex === page.pageIndex ? { ...p, selected: !p.selected } : p
    );
    this.pagesChanged.emit(updated);
  }

  selectAll() {
    const updated = this.pages.map(p => ({ ...p, selected: true }));
    this.pagesChanged.emit(updated);
  }

  deselectAll() {
    const updated = this.pages.map(p => ({ ...p, selected: false }));
    this.pagesChanged.emit(updated);
  }

  // ─── Rotation ─────────────────────────────────────────────────────
  rotatePage(page: PdfPage, delta: number) {
    const updated = this.pages.map(p =>
      p.pageIndex === page.pageIndex
        ? { ...p, rotation: ((p.rotation + delta) % 360 + 360) % 360 }
        : p
    );
    this.pagesChanged.emit(updated);
  }

  rotateAll(delta: number) {
    const updated = this.pages.map(p => ({
      ...p,
      rotation: ((p.rotation + delta) % 360 + 360) % 360,
    }));
    this.pagesChanged.emit(updated);
  }

  resetRotation(page: PdfPage) {
    const updated = this.pages.map(p =>
      p.pageIndex === page.pageIndex ? { ...p, rotation: 0 } : p
    );
    this.pagesChanged.emit(updated);
  }

  resetAllRotations() {
    const updated = this.pages.map(p => ({ ...p, rotation: 0 }));
    this.pagesChanged.emit(updated);
  }

  getRotationClass(rotation: number): string {
    const normalized = ((rotation % 360) + 360) % 360;
    if (normalized === 90) return 'rotate-90';
    if (normalized === 180) return 'rotate-180';
    if (normalized === 270) return 'rotate-270';
    return 'rotate-0';
  }

  // ─── Organize (drag & drop) ────────────────────────────────────────
  onDragStart(event: DragEvent, index: number) {
    this.dragSourceIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverIndex = index;
  }

  onDragLeave() {
    this.dragOverIndex = null;
  }

  onDrop(event: DragEvent, dropIndex: number) {
    event.preventDefault();
    if (this.dragSourceIndex === null || this.dragSourceIndex === dropIndex) {
      this.dragSourceIndex = null;
      this.dragOverIndex = null;
      return;
    }
    const updated = [...this.pages];
    const [removed] = updated.splice(this.dragSourceIndex, 1);
    updated.splice(dropIndex, 0, removed);
    this.dragSourceIndex = null;
    this.dragOverIndex = null;
    this.pagesChanged.emit(updated);
  }

  onDragEnd() {
    this.dragSourceIndex = null;
    this.dragOverIndex = null;
  }

  // ─── Split ────────────────────────────────────────────────────────
  toggleSplitPoint(afterPageIndex: number) {
    const next = new Set(this.splitPoints);
    if (next.has(afterPageIndex)) {
      next.delete(afterPageIndex);
    } else {
      next.add(afterPageIndex);
    }
    this.splitPointsChanged.emit(next);
  }

  isSplitPoint(afterPageIndex: number): boolean {
    return this.splitPoints.has(afterPageIndex);
  }
}
