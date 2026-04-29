import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MainComponent } from "./main.component";

describe("MainComponent", () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with typing animation", () => {
    expect(component.displayText).toBeDefined();
    expect(component["phrases"].length).toBeGreaterThan(0);
  });

  it("should have initial displayText as empty string", () => {
    expect(component.displayText).toBe("");
  });
});
