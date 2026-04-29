import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICONS } from '../../../data/icons';
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';

@Component({
  selector: 'app-privacy-banner',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  template: `
    <div class="w-full">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (pillar of pillars; track pillar) {
          <div class="relative bg-card border border-main rounded-3xl p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 group" [style.backgroundColor]="'var(--bg-card)'" [style.borderColor]="'var(--border-main)'" [style.boxShadow]="'var(--shadow-card)'">
            <!-- subtle hover glow -->
            <div class="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" [style.backgroundColor]="pillar.glowColor"></div>
            <div class="relative flex justify-between items-start mb-5">
              <div class="flex items-center justify-center w-12 h-12 rounded-2xl" [ngClass]="pillar.iconBg">
                <svg [attr.class]="'w-6 h-6 ' + pillar.iconColor" [attr.viewBox]="getIconData(pillar.icon).viewBox" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="getIconData(pillar.icon).path | safeHtml"></svg>
              </div>
              <span class="text-xs font-black px-2.5 py-1 rounded-full" [ngClass]="pillar.accentBadge">
                {{ pillar.badge }}
              </span>
            </div>
            <h3 class="text-base font-bold text-main mb-2" style="color: var(--text-main);">{{ pillar.title }}</h3>
            <p class="text-sm text-muted leading-relaxed" style="color: var(--text-muted);">{{ pillar.description }}</p>
          </div>
        }
      </div>
    </div>
    `,
  styles: []
})
export class PrivacyBannerComponent {
  getIconData(name: string) {
    return ICONS[name] || ICONS['file'];
  }
  pillars = [
    {
      icon: "server-off",
      iconBg: "bg-indigo-50 dark:bg-indigo-500/10",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      accentBadge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
      glowColor: "rgba(99, 102, 241, 0.4)",
      badge: "Client Side",
      title: "Zero server contact",
      description: "Your PDF files are processed entirely inside your browser. They never leave your device — not even for a millisecond.",
    },
    {
      icon: "eye-off",
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      accentBadge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
      glowColor: "rgba(16, 185, 129, 0.4)",
      badge: "No Tracking",
      title: "Completely private",
      description: "No accounts. No analytics on your files. No upload logs. What you do with your PDFs stays between you and your browser.",
    },
    {
      icon: "zap",
      iconBg: "bg-amber-50 dark:bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
      accentBadge: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
      glowColor: "rgba(245, 158, 11, 0.4)",
      badge: "Instant",
      title: "No wait times",
      description: "No upload queues. No server bottlenecks. Processing happens at browser speed — results are ready in seconds.",
    },
    {
      icon: "layers",
      iconBg: "bg-rose-50 dark:bg-rose-500/10",
      iconColor: "text-rose-600 dark:text-rose-400",
      accentBadge: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
      glowColor: "rgba(244, 63, 94, 0.4)",
      badge: "Unlimited",
      title: "No file limits",
      description: "Process documents of any size. No restrictions on page counts or file dimensions — all handled right in your browser.",
    },
  ];
}
