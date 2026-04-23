import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="relative w-full max-w-2xl mx-auto mb-12">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <app-icon name="search" className="h-5 w-5 text-slate-400 dark:text-slate-500"></app-icon>
      </div>
      <input
        type="text"
        class="block w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
        [placeholder]="placeholder"
        (input)="onInput($event)"
      />
    </div>
  `
})
export class SearchBarComponent {
  @Input() placeholder: string = "Search for a tool (e.g. merge, word, rotate)...";
  @Output() search = new EventEmitter<string>();

  onInput(event: any) {
    this.search.emit(event.target.value.toLowerCase());
  }
}
