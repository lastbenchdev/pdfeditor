import { Component, OnInit } from '@angular/core';

import { SearchBarComponent } from './search-bar/search-bar.component';
import { CategoryNavComponent } from './category-nav/category-nav.component';
import { CategorySectionComponent } from './category-section/category-section.component';
import { ActivatedRoute, Router } from '@angular/router';
import { toolsData, Tool } from '../../data/tools';
import { categoriesData, Category } from '../../data/categories';

@Component({
  selector: 'app-explore-all-tools',
  standalone: true,
  imports: [
    SearchBarComponent,
    CategoryNavComponent,
    CategorySectionComponent
],
  templateUrl: './explore-all-tools.component.html',
  styleUrl: './explore-all-tools.component.css',
})
export class ExploreAllToolsComponent implements OnInit {
  searchQuery: string = '';
  selectedCategoryId: string = 'all';
  tools: Tool[] = toolsData;
  categories: Category[] = categoriesData;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

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
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategoryId = params['category'];
      } else {
        this.selectedCategoryId = 'all';
      }
    });
  }

  onSearch(query: string) {
    this.searchQuery = query;
  }

  onSelectCategory(id: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: id === 'all' ? null : id },
      queryParamsHandling: 'merge'
    });
    this.searchQuery = ''; 
  }

  getFilteredToolsForCategory(categoryId: string): Tool[] {
    return this.filteredTools.filter(t => t.category === categoryId);
  }

  resetFilters() {
    this.searchQuery = '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: null },
      queryParamsHandling: 'merge'
    });
  }
}
