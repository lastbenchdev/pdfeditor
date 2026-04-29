import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfToImageComponent } from './pdf-to-image.component';

describe('PdfToImageComponent', () => {
  let component: PdfToImageComponent;
  let fixture: ComponentFixture<PdfToImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfToImageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PdfToImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.files).toEqual([]);
    expect(component.format).toBe('jpeg');
    expect(component.scale).toBe('2');
  });

  it('should handle file selection', () => {
    const testFiles: File[] = [new File(['test'], 'test.pdf', { type: 'application/pdf' })];
    component.onFilesChanged(testFiles);
    
    expect(component.files).toEqual(testFiles);
  });

  it('should show error when no PDF file selected', async () => {
    component.files = [];
    await component.onProcess();
    
    expect(component.errorMessage).toContain('Please select a PDF file');
  });
});
