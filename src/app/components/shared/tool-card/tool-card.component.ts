import { Component, Input, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { ICONS } from '../../../data/icons';
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';
import { Tool } from '../../../data/tools';

@Component({
  selector: 'app-tool-card',
  standalone: true,
  imports: [RouterModule, SafeHtmlPipe],
  template: `
    <div class="relative bg-card border border-main rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 group"
      [style.borderLeftWidth]="'4px'"
      [style.borderLeftColor]="cardColor"
      [style.backgroundColor]="'var(--bg-card)'"
      [style.borderColor]="'var(--border-main)'"
      [style.boxShadow]="'var(--shadow-card)'"
      (click)="navigate()">
    
      <!-- Content -->
      <div class="flex items-center gap-5 p-5">
        <!-- Icon -->
        <div class="flex-shrink-0">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            [style.backgroundColor]="'rgba(' + cardColorRgb + ', 0.12)'"
            [style.color]="cardColor">
            <svg class="w-6 h-6" [attr.viewBox]="getIconData(icon).viewBox" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="getIconData(icon).path | safeHtml"></svg>
          </div>
        </div>
    
        <!-- Text -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h3 class="text-sm font-bold text-main truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" style="color: var(--text-main);">
              {{ title }}
            </h3>
            <div class="flex gap-1 flex-shrink-0">
              @if (status === 'beta') {
                <span class="text-xs font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                  Beta
                </span>
              }
              @if (status === 'coming_soon') {
                <span class="text-xs font-bold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  Coming soon
                </span>
              }
              @if (isLocal && showLocalBadge) {
                <span class="text-xs font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                  Local
                </span>
              }
            </div>
          </div>
          <p class="text-xs text-muted line-clamp-2" style="color: var(--text-muted);">{{ description }}</p>
        </div>
    
        <!-- Arrow -->
        <div class="flex-shrink-0 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-muted" style="color: var(--text-muted);">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
    </div>
    `,
  styles: []
})
export class ToolCardComponent implements OnInit {
  @Input() title!: string;
  @Input() description!: string;
  @Input() icon!: string;
  @Input() status?: string;
  @Input() isLocal: boolean = true;
  @Input() showLocalBadge: boolean = true;
  @Input() route?: string;
  @Input() category: string = 'basic';

  cardColor = '#6366f1';
  cardColorRgb = '99, 102, 241';

  getIconData(name: string) {
    return ICONS[name] || ICONS['file'];
  }

  ngOnInit() {
    const colorMap: any = {
      'basic': { hex: '#6366f1', rgb: '99, 102, 241' },
      'optimize': { hex: '#f59e0b', rgb: '245, 158, 11' },
      'convert-to': { hex: '#10b981', rgb: '16, 185, 129' },
      'convert-from': { hex: '#06b6d4', rgb: '6, 182, 212' },
      'edit': { hex: '#8b5cf6', rgb: '139, 92, 246' },
      'security': { hex: '#ef4444', rgb: '239, 68, 68' }
    };
    const color = colorMap[this.category] || colorMap['basic'];
    this.cardColor = color.hex;
    this.cardColorRgb = color.rgb;
  }

  navigate() {
    if (this.route) {
      window.location.hash = this.route;
    }
  }
}
