import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticatedSearchCategoryComponent } from './authenticated-search-category.component';

describe('AuthenticatedSearchCategoryComponent', () => {
  let component: AuthenticatedSearchCategoryComponent;
  let fixture: ComponentFixture<AuthenticatedSearchCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticatedSearchCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticatedSearchCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
