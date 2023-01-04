import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorFooterComponent } from './error-footer.component';

describe('ErrorFooterComponent', () => {
  let component: ErrorFooterComponent;
  let fixture: ComponentFixture<ErrorFooterComponent>;
  let divElement: () => HTMLDivElement | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ErrorFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorFooterComponent);
    component = fixture.componentInstance;

    divElement = () => fixture.nativeElement.querySelector('div');

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  it('should only appear if error and displayError are both truthy', () => {
    expect(divElement()).toBeNull();

    component.displayError = true;
    fixture.detectChanges();
    expect(divElement()).toBeNull();

    component.displayError = false;
    component.error = 'error';
    fixture.detectChanges();
    expect(divElement()).toBeNull();

    component.displayError = true;
    fixture.detectChanges();
    expect(divElement()).not.toBeNull();
  });
});
