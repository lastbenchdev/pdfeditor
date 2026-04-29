import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HtmlToPdfComponent } from './html-to-pdf.component';

describe('HtmlToPdfComponent', () => {
  let component: HtmlToPdfComponent;
  let fixture: ComponentFixture<HtmlToPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtmlToPdfComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HtmlToPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.htmlContent).toBe('');
    expect(component.pageSize).toBe('A4');
    expect(component.orientation).toBe('portrait');
    expect(component.errorMessage).toBe('');
  });

  it('should show error when converting empty content', () => {
    component.htmlContent = '';
    component.convertToPdf();
    
    expect(component.errorMessage).toContain('Please enter some HTML content');
  });

  it('should open print dialog when converting valid content', () => {
    spyOn(window, 'open').and.returnValue({} as Window);
    component.htmlContent = '<h1>Test</h1>';
    component.convertToPdf();
    
    expect(window.open).toHaveBeenCalled();
  });
});
