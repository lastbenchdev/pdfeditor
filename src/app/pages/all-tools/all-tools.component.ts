import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { CategoryNavComponent } from '../../components/category-nav/category-nav.component';
import { CategorySectionComponent } from '../../components/category-section/category-section.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { IconComponent } from '../../components/icon/icon.component';
import { toolsData, Tool } from '../../data/tools';
import { categoriesData, Category } from '../../data/categories';

@Component({
  selector: 'app-all-tools',
  standalone: true,
  imports: [
    CommonModule, 
    SearchBarComponent, 
    CategoryNavComponent, 
    CategorySectionComponent, 
    FooterComponent,
    IconComponent
  ],
  template: `
    <div class="min-h-screen pt-20 pb-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-6 text-center mb-10">
        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">All PDF Tools</h1>
        <p class="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          The complete toolkit for all your PDF requirements.
        </p>
      </div>

      <div class="max-w-7xl mx-auto px-6 z-40 relative group">
        <app-search-bar 
          (search)="onSearch($event)"
        ></app-search-bar>
      </div>

      <app-category-nav 
        [selectedCategoryId]="selectedCategoryId" 
        (selectCategory)="onSelectCategory($event)"
      ></app-category-nav>

      <div class="space-y-4">
        <app-category-section 
          *ngFor="let category of displayedCategories"
          [category]="category"
          [tools]="getFilteredToolsForCategory(category.id)"
        ></app-category-section>
        
        <div *ngIf="filteredTools.length === 0" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-900 mb-6">
            <app-icon name="search" className="w-10 h-10 text-slate-400"></app-icon>
          </div>
          <p class="text-xl text-slate-500 dark:text-slate-400 mb-4 font-bold">No tools found matching your search.</p>
          <button 
            (click)="resetFilters()"
            class="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            Clear filters and search
          </button>
        </div>
      </div>

      <app-footer></app-footer>
    </div>
  `
})
export class AllToolsComponent implements OnInit {
  searchQuery: string = '';
  selectedCategoryId: string = 'all';
  tools: Tool[] = toolsData;
  categories: Category[] = categoriesData;

  get filteredTools(): Tool[] {
    if (!this.searchQuery) return this.tools;
    
    return this.tools.filter(tool =>
      tool.name.toLowerCase().includes(this.searchQuery) ||
      tool.keywords.some(k => k.toLowerCase().includes(this.searchQuery)) ||
      tool.tags.some(t => t.toLowerCase().includes(this.searchQuery))
    );
  }

  get displayedCategories(): Category[] {
    if (this.searchQuery) {
      return this.categories.filter(cat => 
        this.filteredTools.some(tool => tool.category === cat.id)
      );
    }
    
    if (this.selectedCategoryId === 'all') {
      return this.categories;
    }
    
    return this.categories.filter(cat => cat.id === this.selectedCategoryId);
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  onSearch(query: string) {
    this.searchQuery = query;
  }

  onSelectCategory(id: string) {
    this.selectedCategoryId = id;
    this.searchQuery = ''; 
  }

  getFilteredToolsForCategory(categoryId: string): Tool[] {
    return this.filteredTools.filter(t => t.category === categoryId);
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategoryId = 'all';
  }
}
