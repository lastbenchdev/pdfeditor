import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { categoriesData } from '../../../data/categories';
import { ICONS } from '../../../data/icons';
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';

@Component({
  selector: 'app-category-nav',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './category-nav.component.html',
  styleUrl: './category-nav.component.css'
})
export class CategoryNavComponent implements AfterViewChecked {
  getIconData(name: string) {
    return ICONS[name] || ICONS['file'];
  }
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
      // Logic for smooth scroll could go here
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
