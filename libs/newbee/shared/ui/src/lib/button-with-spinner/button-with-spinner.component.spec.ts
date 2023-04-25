import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonWithSpinnerComponent } from './button-with-spinner.component';

describe('ButtonWithSpinnerComponent', () => {
  let component: ButtonWithSpinnerComponent;
  let fixture: ComponentFixture<ButtonWithSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonWithSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonWithSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
