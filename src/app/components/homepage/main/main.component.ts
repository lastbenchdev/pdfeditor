import { Component, OnInit, OnDestroy } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit, OnDestroy {
  displayText = '';
  private phrases = [
    "Free & Open Source.",
    "No Signup Required.",
    "In-Browser."
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
