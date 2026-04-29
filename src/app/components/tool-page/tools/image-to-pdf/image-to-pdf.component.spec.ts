import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageToPdfComponent } from './image-to-pdf.component';

describe('ImageToPdfComponent', () => {
  let component: ImageToPdfComponent;
  let fixture: ComponentFixture<ImageToPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageToPdfComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageToPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.files).toEqual([]);
    expect(component.pageSize).toBe('fit');
    expect(component.margin).toBe(0);
  });

  it('should handle file selection', () => {
    const testFiles: File[] = [new File(['test'], 'test.jpg', { type: 'image/jpeg' })];
    component.onFilesChanged(testFiles);
    
    expect(component.files).toEqual(testFiles);
  });

  it('should show error when no files selected', async () => {
    component.files = [];
    await component.onProcess();
    
    expect(component.errorMessage).toContain('Please select at least one image');
  });
});
