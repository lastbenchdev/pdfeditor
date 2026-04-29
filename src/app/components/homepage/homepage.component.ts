import { Component } from "@angular/core";

import { RouterModule } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { PrivacyBannerComponent } from "./privacy-banner/privacy-banner.component";

@Component({
  selector: "app-homepage",
  standalone: true,
  imports: [RouterModule, MainComponent, PrivacyBannerComponent],
  templateUrl: "./homepage.component.html",
  styleUrl: "./homepage.component.css",
})
export class HomepageComponent {}
