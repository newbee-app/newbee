import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticatedActionItemComponent } from './authenticated-action-item.component';

describe('AuthenticatedActionItemComponent', () => {
  let component: AuthenticatedActionItemComponent;
  let fixture: ComponentFixture<AuthenticatedActionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticatedActionItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticatedActionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
