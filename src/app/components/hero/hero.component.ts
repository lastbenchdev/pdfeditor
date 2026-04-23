import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, IconComponent, RouterModule],
  template: `
    <section class="relative overflow-hidden pt-12 pb-8 md:pt-20 md:pb-12 bg-white dark:bg-slate-950">
      <!-- Premium Background Spotlight Effect -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_top,_var(--color-accent-hover)_0%,_transparent_70%)] opacity-[0.03] dark:opacity-[0.07]"></div>
      
      <div class="max-w-5xl mx-auto px-6 text-center relative">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          Next-Gen PDF Tools
        </div>

        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-8">
          All-in-one PDF tools. <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-accent to-indigo-400 min-h-[1.2em] inline-block md:whitespace-nowrap">
            {{ displayText }}
            <span class="inline-block w-[3px] h-[0.8em] bg-accent ml-1 -mb-1 animate-pulse"></span>
          </span>
        </h1>

        <p class="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-4xl mx-auto mb-12 leading-relaxed font-medium md:whitespace-nowrap">
          Merge, split, compress, and edit your PDFs directly in your browser. 
          <span class="block mt-3 text-slate-900 dark:text-white font-bold"> 
            Your files never leave your device. 
          </span>
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a 
            routerLink="/tools" 
            class="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-accent text-white font-extrabold rounded-full transition-all hover:bg-accent-hover hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
          >
            <app-icon name="pickaxe" className="w-6 h-6 transition-transform group-hover:rotate-12"></app-icon>
            Explore all tools
          </a>
        </div>
      </div>
    </section>
  `
})
export class HeroComponent implements OnInit, OnDestroy {
  displayText = '';
  private phrases = [
    "Ad Free & Open Source.",
    "Client-side & Privacy-oriented.",
    "100% In-Browser."
  ];
  private phraseIndex = 0;
  private isDeleting = false;
  private typingSpeed = 150;
  private timer: any;

  ngOnInit() {
    this.handleTyping();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  private handleTyping() {
    const currentPhrase = this.phrases[this.phraseIndex];
    
    if (this.isDeleting) {
      this.displayText = currentPhrase.substring(0, this.displayText.length - 1);
      this.typingSpeed = 50;
    } else {
      this.displayText = currentPhrase.substring(0, this.displayText.length + 1);
      this.typingSpeed = 100;
    }

    if (!this.isDeleting && this.displayText === currentPhrase) {
      this.timer = setTimeout(() => {
        this.isDeleting = true;
        this.handleTyping();
      }, 2000);
    } else if (this.isDeleting && this.displayText === '') {
      this.isDeleting = false;
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      this.timer = setTimeout(() => this.handleTyping(), 500);
    } else {
      this.timer = setTimeout(() => this.handleTyping(), this.typingSpeed);
    }
  }
}
