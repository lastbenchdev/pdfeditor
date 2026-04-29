import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  template: `
    <div class="relative w-full max-w-2xl mx-auto mb-12">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-muted" style="color: var(--text-muted);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <input
        type="text"
        class="block w-full pl-12 pr-4 py-4 bg-card border border-main rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all text-main"
        [placeholder]="placeholder"
        (input)="onInput($event)"
        style="background-color: var(--bg-card); border-color: var(--border-main); color: var(--text-main);"
      />
    </div>
  `,
  styles: []
})
export class SearchBarComponent {
  @Input() placeholder: string = "Search for a tool (e.g. merge, word, rotate)...";
  @Output() search = new EventEmitter<string>();

  onInput(event: any) {
    this.search.emit(event.target.value.toLowerCase());
  }
}
