import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ExploreAllToolsComponent } from "./explore-all-tools.component";

describe("ExploreAllToolsComponent", () => {
  let component: ExploreAllToolsComponent;
  let fixture: ComponentFixture<ExploreAllToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreAllToolsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExploreAllToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
