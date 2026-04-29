import { Component, Input } from '@angular/core';

import { Router } from '@angular/router';
import { ToolCardComponent } from '../../shared/tool-card/tool-card.component';
import { ICONS } from '../../../data/icons';
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';
import { Tool } from '../../../data/tools';
import { Category } from '../../../data/categories';

@Component({
  selector: 'app-category-section',
  standalone: true,
  imports: [ToolCardComponent, SafeHtmlPipe],
  template: `
    @if (tools.length > 0) {
      <section [id]="category.id" class="max-w-7xl mx-auto px-6 py-10 border-b border-main" style="border-color: var(--border-main);">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div class="flex items-start gap-4">
            <div class="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <svg class="w-6 h-6" [attr.viewBox]="getIconData(category.icon).viewBox" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="getIconData(category.icon).path | safeHtml"></svg>
            </div>
            <div>
              <h2 class="text-2xl font-black text-main -tracking-wider">{{ category.name }}</h2>
              <p class="text-sm text-muted mt-1">{{ category.description }}</p>
            </div>
          </div>
          <span class="inline-block px-3 py-1 rounded-full bg-surface border border-main text-xs font-bold text-muted whitespace-nowrap" style="background-color: var(--bg-surface); border-color: var(--border-main);">
            {{ tools.length }} tool{{ tools.length !== 1 ? 's' : '' }}
          </span>
        </div>
        <!-- Tools Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (tool of tools; track tool; let i = $index) {
            <app-tool-card
              [style.animation-delay]="i * 50 + 'ms'"
              [title]="tool.name"
              [description]="tool.description"
              [icon]="tool.icon"
              [status]="tool.status"
              [isLocal]="tool.isLocal"
              [route]="tool.route"
              [category]="tool.category"
              (click)="onToolClick(tool)"
            ></app-tool-card>
          }
        </div>
      </section>
    }
    `,
  styles: []
})
export class CategorySectionComponent {
  getIconData(name: string) {
    return ICONS[name] || ICONS['file'];
  }
  @Input() category!: Category;
  @Input() tools: Tool[] = [];

  constructor(private router: Router) {}

  onToolClick(tool: Tool) {
    this.router.navigateByUrl(tool.route);
  }
}
