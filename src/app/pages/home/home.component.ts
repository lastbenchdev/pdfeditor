import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { ToolsGridComponent } from '../../components/tools-grid/tools-grid.component';
import { PrivacyBannerComponent } from '../../components/privacy-banner/privacy-banner.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { topSixTools } from '../../data/tools';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    HeroComponent, 
    PrivacyBannerComponent, 
    ToolsGridComponent, 
    FooterComponent
  ],
  template: `
    <div class="pb-20 bg-white dark:bg-slate-950">
      <app-hero></app-hero>
      <app-privacy-banner></app-privacy-banner>
      <app-tools-grid
        title="Popular Tools"
        description="The PDF operations everyone reaches for, all in one place."
        [tools]="popularTools"
        [showLocalBadge]="false"
      ></app-tools-grid>
      <app-footer></app-footer>
    </div>
  `
})
export class HomeComponent {
  popularTools = topSixTools;
}
