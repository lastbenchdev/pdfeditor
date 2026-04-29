import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header class="sticky top-0 z-50 border-b border-main bg-opacity-85 backdrop-blur-md transition-all duration-500" style="background-color: var(--glass-bg); border-color: var(--border-main);">
      <div class="w-full max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-3 no-underline hover:scale-105 transition-transform">
          <div class="relative flex items-center justify-center">
            <div class="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 via-blue-500 to-violet-600 blur-lg opacity-30 animate-pulse"></div>
            <div class="relative p-1.5 rounded-lg bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 shadow-lg border border-white/10">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="m9 15 2 2 4-4"></path>
              </svg>
            </div>
          </div>
          <span class="hidden sm:inline font-black text-lg -tracking-wider text-main">PDF Editor</span>
        </a>
    
        <!-- Navigation -->
        <nav class="flex items-center gap-4">
          <!-- Main Website -->
          <a
            href="https://lastbench.dev"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 shadow-sm group"
            >
            <span class="text-muted group-hover:text-indigo-600 transition-colors uppercase tracking-widest opacity-70">Project of</span>
            <span class="text-gradient text-sm tracking-tight">lastbench.dev</span>
          </a>
    
          <!-- Theme Toggle -->
          <button
            (click)="toggleTheme()"
            [title]="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            class="p-2.5 rounded-xl bg-surface border border-main hover:border-indigo-400 hover:text-indigo-500 dark:hover:border-indigo-500 dark:hover:text-indigo-400 text-main transition-all duration-200 flex items-center justify-center hover:scale-110 active:scale-95 shadow-sm"
            >
            @if (isDark) {
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            }
            @if (!isDark) {
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            }
          </button>
    
          <!-- GitHub -->
          <a
            href="https://github.com/lastbenchdev/pdfeditor"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-bold text-xs hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 border border-white/10"
            >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.62-.3 7.5-1.89 7.5-8.38a4.8 4.8 0 0 0-1.5-3.5 4.8 4.8 0 0 0 .1-3.4s-1.2-.38-3.9 1.5a13.3 13.3 0 0 0-7 0C6.2 2.5 5 2.88 5 2.88a4.8 4.8 0 0 0 .1 3.4 4.8 4.8 0 0 0-1.5 3.5c0 6.47 3.88 8.08 7.5 8.38a4.8 4.8 0 0 0-1 2.92v4.1" />
            </svg>
            <span class="hidden md:inline">GitHub</span>
          </a>
        </nav>
      </div>
    </header>
    `,
  styles: []
})
export class HeaderComponent implements OnInit {
  isDark = false;

  ngOnInit() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      this.isDark = true;
    } else if (saved === 'light') {
      this.isDark = false;
    } else {
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    this.applyTheme();
  }

  private applyTheme() {
    const root = document.documentElement;
    if (this.isDark) {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
}
