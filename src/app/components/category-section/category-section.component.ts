import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolCardComponent } from '../tool-card/tool-card.component';
import { Tool } from '../../data/tools';
import { Category } from '../../data/categories';

@Component({
  selector: 'app-category-section',
  standalone: true,
  imports: [CommonModule, ToolCardComponent],
  template: `
    <section *ngIf="tools.length > 0" [id]="category.id" class="py-12 border-b border-slate-200 dark:border-slate-800 last:border-0">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col mb-10">
          <h2 class="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            {{ category.name }}
          </h2>
          <p class="text-slate-500 dark:text-slate-400">{{ category.description }}</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-tool-card
            *ngFor="let tool of tools"
            [title]="tool.name"
            [description]="tool.description"
            [icon]="tool.icon"
            [status]="tool.status"
            [isLocal]="tool.isLocal"
            (click)="onToolClick(tool)"
          ></app-tool-card>
        </div>
      </div>
    </section>
  `
})
export class CategorySectionComponent {
  @Input() category!: Category;
  @Input() tools: Tool[] = [];

  onToolClick(tool: Tool) {
    console.log('Tool clicked:', tool.name);
  }
}
