import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoOrgComponent } from './no-org.component';

describe('NoOrgComponent', () => {
  let component: NoOrgComponent;
  let fixture: ComponentFixture<NoOrgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoOrgComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoOrgComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });
});
