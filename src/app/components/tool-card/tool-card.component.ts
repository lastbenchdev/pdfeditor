import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-tool-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div 
      class="group relative flex flex-col p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm 
             hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 no-underline cursor-pointer h-full"
      [ngClass]="{'opacity-90': status === 'experimental', 'opacity-100': status !== 'experimental'}"
      role="button" 
      tabIndex="0"
    >
      <!-- Top row: Icon + Status -->
      <div class="flex items-start justify-between mb-5">
        <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 transition-all duration-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 shadow-sm group-hover:shadow-indigo-200 dark:group-hover:shadow-indigo-900/40">
          <app-icon [name]="icon"></app-icon>
        </div>
        
        <div class="flex flex-col items-end gap-1.5">
          <span *ngIf="isLocal && showLocalBadge" class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
            Local
          </span>
          <span *ngIf="status === 'experimental'" class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
            Experimental
          </span>
          <span *ngIf="status === 'beta'" class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
            Beta
          </span>
        </div>
      </div>
      
      <!-- Content -->
      <h3 class="text-lg font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
        {{ title }}
      </h3>

      <p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400 transition-colors duration-300 line-clamp-3">
        {{ description }}
      </p>

      <!-- Decorative arrow -->
      <div class="mt-auto pt-6 flex items-center text-xs font-bold text-indigo-500/0 group-hover:text-indigo-500 transition-all duration-500 translate-x--2 group-hover:translate-x-0">
        Try tool <span class="ml-1">→</span>
      </div>
    </div>
  `
})
export class ToolCardComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() icon: string = '';
  @Input() status?: 'ready' | 'beta' | 'experimental';
  @Input() isLocal?: boolean;
  @Input() showLocalBadge: boolean = true;
}
