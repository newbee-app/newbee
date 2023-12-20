import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Frequency } from '@newbee/newbee/shared/util';
import { NumAndFreqInputComponent } from './num-and-freq-input.component';

describe('NumAndFreqInputComponent', () => {
  let component: NumAndFreqInputComponent;
  let fixture: ComponentFixture<NumAndFreqInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumAndFreqInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NumAndFreqInputComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('writeValue', () => {
    it('should change internal control', () => {
      component.writeValue({ num: 1, frequency: Frequency.Year });
      expect(component.numAndFreq.value).toEqual({
        num: 1,
        frequency: Frequency.Year,
      });
    });
  });

  describe('setDisabledState', () => {
    it(`should set internal form's disabled state`, () => {
      component.setDisabledState(true);
      expect(component.numAndFreq.disabled).toBeTruthy();
      component.setDisabledState(false);
      expect(component.numAndFreq.disabled).toBeFalsy();
    });
  });
});
