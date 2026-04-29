import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryNavComponent } from './category-nav.component';
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';

describe('CategoryNavComponent', () => {
  let component: CategoryNavComponent;
  let fixture: ComponentFixture<CategoryNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryNavComponent, SafeHtmlPipe]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selectCategory when onSelectCategory is called', () => {
    spyOn(component.selectCategory, 'emit');
    component.onSelectCategory('test-cat');
    expect(component.selectCategory.emit).toHaveBeenCalledWith('test-cat');
  });
});
