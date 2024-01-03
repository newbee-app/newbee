import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ToastXPosition,
  ToastYPosition,
  testToast1,
} from '@newbee/newbee/shared/util';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;

    component.toast = testToast1;

    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    jest.spyOn(global, 'clearTimeout');
    jest.spyOn(component.dismissed, 'emit');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('toastClasses', () => {
    it('should get toast classes', () => {
      for (const x of Object.values(ToastXPosition)) {
        for (const y of Object.values(ToastYPosition)) {
          component.toast = { ...testToast1, position: [x, y] };
          expect(component.toastClasses).toEqual([
            'toast',
            `toast-${x}`,
            `toast-${y}`,
          ]);
        }
      }
    });
  });

  describe('ngOnInit', () => {
    it('should set up timer if changes has new values for toast', () => {
      expect(component.show).toBeTruthy();
      expect(setTimeout).toHaveBeenCalledTimes(1);
    });

    it('should dismiss immediately if there is no text', () => {
      component.toast = { ...testToast1, header: '', text: '' };
      component.ngOnInit();
      expect(component.show).toBeFalsy();
      expect(component.dismissed.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearTimeout', () => {
    it('should call clearTimeout if timeout is not null', () => {
      component.clearTimeout();
      expect(clearTimeout).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if timeout is null', () => {
      component.clearTimeout();
      component.clearTimeout();
      expect(clearTimeout).toHaveBeenCalledTimes(1);
    });
  });

  describe('dismiss', () => {
    it('should call clearTimeout, set show to false, and emit dismissed', () => {
      jest.spyOn(component, 'clearTimeout');
      component.dismiss();
      expect(component.clearTimeout).toHaveBeenCalledTimes(1);
      expect(component.show).toBeFalsy();
      expect(component.dismissed.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('onShowChange', () => {
    it('should only call dismiss if show value is false', () => {
      jest.spyOn(component, 'dismiss');
      component.onShowChange(true);
      expect(component.dismiss).not.toHaveBeenCalled();
      component.onShowChange(false);
      expect(component.dismiss).toHaveBeenCalledTimes(1);
    });
  });
});
