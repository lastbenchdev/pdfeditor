import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolCardComponent } from '../tool-card/tool-card.component';
import { Tool } from '../../data/tools';

@Component({
  selector: 'app-tools-grid',
  standalone: true,
  imports: [CommonModule, ToolCardComponent],
  template: `
    <section [id]="id" class="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-500">
      <div class="max-w-7xl mx-auto px-6">
        <div *ngIf="title || description" class="text-center mb-16 max-w-2xl mx-auto">
          <h2 *ngIf="title" class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            {{ title }}
          </h2>
          <p *ngIf="description" class="text-lg text-slate-500 dark:text-slate-400 font-medium">
            {{ description }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <app-tool-card
            *ngFor="let tool of tools"
            [title]="tool.name"
            [description]="tool.description"
            [icon]="tool.icon"
            [status]="tool.status"
            [isLocal]="tool.isLocal"
            [showLocalBadge]="showLocalBadge"
            (click)="onToolClick(tool)"
          ></app-tool-card>
        </div>
      </div>
    </section>
  `
})
export class ToolsGridComponent {
  @Input() title?: string;
  @Input() description?: string;
  @Input() tools: Tool[] = [];
  @Input() id?: string;
  @Input() showLocalBadge: boolean = true;

  onToolClick(tool: Tool) {
    console.log('Tool clicked:', tool.name);
    // For now, we don't have an editor to navigate to.
  }
}
