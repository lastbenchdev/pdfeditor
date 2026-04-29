import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="border-t border-main bg-surface transition-colors duration-500" style="background-color: var(--bg-surface); border-color: var(--border-main);">
      <div class="max-w-7xl mx-auto px-6 py-20">
        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div class="space-y-6">
            <a routerLink="/" class="flex items-center gap-3 no-underline hover:scale-105 transition-all duration-300 w-fit group">
              <div class="relative flex items-center justify-center">
                <div class="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500 via-blue-500 to-violet-600 blur-lg opacity-30 group-hover:opacity-50 transition-opacity animate-pulse"></div>
                <div class="relative p-1.5 rounded-lg bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 shadow-lg border border-white/10">
                  <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <path d="m9 15 2 2 4-4"></path>
                  </svg>
                </div>
              </div>
              <span class="font-black text-xl -tracking-wider text-main">PDF Editor</span>
            </a>
            <p class="text-sm text-muted leading-relaxed font-medium">
              Fast, private, and browser-based PDF manipulation tools for your everyday document needs.
            </p>
            <!-- Social Links -->
            <div class="flex gap-3 pt-2">
              <a
                href="https://github.com/lastbenchdev/pdfeditor"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Repository"
                class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-card border border-main text-muted hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300"
              >
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="space-y-4">
            <h5 class="text-xs font-black uppercase tracking-[0.2em] text-main border-b-2 border-indigo-500 pb-2 w-fit">Quick Links</h5>
            <ul class="space-y-3">
              <li>
                <a routerLink="/" class="text-sm text-muted hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 font-semibold flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  Home
                </a>
              </li>
              <li>
                <a routerLink="/tools" class="text-sm text-muted hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 font-semibold flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  Explore Tools
                </a>
              </li>
            </ul>
          </div>

          <!-- Resources -->
          <div class="space-y-4">
            <h5 class="text-xs font-black uppercase tracking-[0.2em] text-main border-b-2 border-violet-500 pb-2 w-fit">Resources</h5>
            <ul class="space-y-3">
              <li>
                <a
                  href="https://github.com/lastbenchdev/pdfeditor"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-muted hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-300 font-semibold flex items-center gap-2"
                >
                  <span class="w-1.5 h-1.5 bg-violet-500 rounded-full"></span>
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/lastbenchdev/pdfeditor/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-muted hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-300 font-semibold flex items-center gap-2"
                >
                  <span class="w-1.5 h-1.5 bg-violet-500 rounded-full"></span>
                  Report Issue
                </a>
              </li>
            </ul>
          </div>

          <!-- Legal -->
          <div class="space-y-4">
            <h5 class="text-xs font-black uppercase tracking-[0.2em] text-main border-b-2 border-amber-500 pb-2 w-fit">Legal</h5>
            <div class="space-y-3">
              <p class="text-sm text-muted font-semibold">
                Licensed under
                <a
                  href="https://github.com/lastbenchdev/pdfeditor/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors font-black underline decoration-amber-500/30 underline-offset-2"
                >
                  AGPL-3.0
                </a>
              </p>
              <p class="text-xs text-muted opacity-70">100% private • Browser-based • Open source</p>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="mt-12 h-px bg-gradient-to-r from-transparent via-main to-transparent" style="border-color: var(--border-main);"></div>

        <!-- Bottom Footer -->
        <div class="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p class="text-xs font-bold uppercase tracking-widest text-muted opacity-70">
            © {{ currentYear }} PDF Editor. All rights reserved.
          </p>
          <p class="text-xs font-bold uppercase tracking-widest text-muted opacity-70">
            BUILT FOR LOCAL-FIRST WORKFLOWS
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
