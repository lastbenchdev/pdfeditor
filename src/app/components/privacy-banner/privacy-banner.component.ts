import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-privacy-banner',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="max-w-7xl mx-auto px-6 mb-10">
      <!-- Section label -->
      <div class="flex items-center justify-center gap-3 mb-6">
        <div class="h-px flex-1 bg-slate-200 dark:bg-slate-800 max-w-[80px]"></div>
        <span class="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Built on trust
        </span>
        <div class="h-px flex-1 bg-slate-200 dark:bg-slate-800 max-w-[80px]"></div>
      </div>

      <!-- Pillar cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          *ngFor="let pillar of pillars"
          class="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 {{ pillar.borderColor }} rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        >
          <!-- Icon + badge row -->
          <div class="flex items-center justify-between mb-4">
            <div class="w-11 h-11 rounded-xl {{ pillar.iconBg }} flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <app-icon [name]="pillar.icon" [className]="'w-5 h-5 ' + pillar.iconColor"></app-icon>
            </div>
            <span class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full {{ pillar.accentBadge }}">
              {{ pillar.badge }}
            </span>
          </div>

          <!-- Text -->
          <h3 class="text-base font-extrabold text-slate-900 dark:text-white mb-1.5 tracking-tight">
            {{ pillar.title }}
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {{ pillar.description }}
          </p>
        </div>
      </div>
    </div>
  `
})
export class PrivacyBannerComponent {
  pillars = [
    {
      icon: 'server-off',
      iconBg: 'bg-indigo-50 dark:bg-indigo-950',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      borderColor: 'hover:border-indigo-300 dark:hover:border-indigo-700',
      accentBadge: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300',
      badge: '100% Local',
      title: 'Zero server contact',
      description: 'Your PDF files are processed entirely inside your browser. They never leave your device — not even for a millisecond.',
    },
    {
      icon: 'eye-off',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      borderColor: 'hover:border-emerald-300 dark:hover:border-emerald-700',
      accentBadge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
      badge: 'No Tracking',
      title: 'Completely private',
      description: 'No accounts. No analytics on your files. No upload logs. What you do with your PDFs stays between you and your browser.',
    },
    {
      icon: 'zap',
      iconBg: 'bg-amber-50 dark:bg-amber-950',
      iconColor: 'text-amber-600 dark:text-amber-400',
      borderColor: 'hover:border-amber-300 dark:hover:border-amber-700',
      accentBadge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
      badge: 'Instant',
      title: 'No wait times',
      description: 'No upload queues. No server bottlenecks. Processing happens at browser speed — results are ready in seconds.',
    },
  ];
}
