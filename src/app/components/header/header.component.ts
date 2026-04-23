import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IconComponent, RouterModule],
  template: `
    <header class="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div class="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        <a routerLink="/" class="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white no-underline">
          <app-icon name="layers" className="text-indigo-600 dark:text-indigo-400"></app-icon>
          <span>PDF Toolkit</span>
        </a>
        <nav class="flex items-center gap-4">
          <button
            class="p-2 rounded-lg bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer flex items-center justify-center transition-all duration-200"
            (click)="toggleTheme()"
            [title]="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            [attr.aria-label]="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <app-icon [name]="isDark ? 'sun' : 'moon'"></app-icon>
          </button>
          <a
            href="https://github.com/THANSHEER/pdf-toolkit"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 px-6 h-10 text-sm font-semibold rounded-full bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <app-icon name="github" className="w-5 h-5"></app-icon>
            <span class="hidden sm:inline">Star on GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  `
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
      localStorage.setItem('theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }
}
