import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { categoriesData } from '../../data/categories';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-category-nav',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="w-full border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-16 z-30 mb-8">
      <div 
        #scrollContainer
        class="w-full flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-4 px-6"
      >
        <button
          *ngFor="let cat of categories"
          (click)="onSelectCategory(cat.id)"
          [attr.data-active]="selectedCategoryId === cat.id"
          class="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 font-bold text-sm border-2"
          [ngClass]="selectedCategoryId === cat.id 
            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md scale-105' 
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400'"
        >
          <app-icon [name]="getIcon(cat.icon)" [className]="'w-4 h-4 ' + (selectedCategoryId === cat.id ? 'text-white' : 'text-current')"></app-icon>
          {{ cat.name }}
        </button>
      </div>
    </div>
  `
})
export class CategoryNavComponent implements AfterViewChecked {
  @Input() selectedCategoryId: string = 'all';
  @Output() selectCategory = new EventEmitter<string>();
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  categories = [
    { id: 'all', name: 'All Tools', icon: 'layers' },
    ...categoriesData
  ];

  ngAfterViewChecked() {
    const activeItem = this.scrollContainer.nativeElement.querySelector('[data-active="true"]');
    if (activeItem) {
      // Logic for smooth scroll could go here if needed, but simple scrollIntoView might cause jumps during CD
    }
  }

  onSelectCategory(id: string) {
    this.selectCategory.emit(id);
  }

  getIcon(icon: string): string {
    if (icon === 'all') return 'layers';
    if (icon === 'minimize') return 'minimize-2';
    return icon;
  }
}
