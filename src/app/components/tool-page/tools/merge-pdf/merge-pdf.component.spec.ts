import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MergePdfComponent } from './merge-pdf.component';
import { MergePdfService } from '../../../../services/merge-pdf.service';

describe('MergePdfComponent', () => {
  let component: MergePdfComponent;
  let fixture: ComponentFixture<MergePdfComponent>;
  let mockMergePdfService: jasmine.SpyObj<MergePdfService>;

  beforeEach(async () => {
    mockMergePdfService = jasmine.createSpyObj('MergePdfService', ['merge']);

    await TestBed.configureTestingModule({
      imports: [MergePdfComponent],
      providers: [
        { provide: MergePdfService, useValue: mockMergePdfService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MergePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty files array', () => {
    expect(component.files).toEqual([]);
    expect(component.downloads).toEqual([]);
  });

  it('should handle file changes', () => {
    const testFiles: File[] = [new File(['test'], 'test.pdf', { type: 'application/pdf' })];
    component.onFilesChanged(testFiles);
    
    expect(component.files).toEqual(testFiles);
    expect(component.errorMessage).toBe('');
  });

  it('should show error when trying to merge less than 2 files', async () => {
    component.files = [new File(['test'], 'test.pdf', { type: 'application/pdf' })];
    await component.onProcess();
    
    expect(component.errorMessage).toContain('at least 2');
  });
});
