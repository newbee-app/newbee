import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastXPosition, ToastYPosition } from '@newbee/newbee/shared/util';
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

    component.duration = 1000;

    jest.resetAllMocks();
    jest.spyOn(component.dismissed, 'emit');
    jest.spyOn(global, 'setTimeout');
    jest.spyOn(global, 'clearTimeout');

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
          component.position = [x, y];
          expect(component.toastClasses).toEqual([
            'toast',
            `toast-${x}`,
            `toast-${y}`,
          ]);
        }
      }
    });
  });

  describe('ngOnChanges', () => {
    it(`should do nothing if changes doesn't have new values for header or text`, () => {
      component.ngOnChanges({});
      component.ngOnChanges({ random: new SimpleChange('', 'random', true) });
      expect(component.show).toBeFalsy();
      expect(setTimeout).not.toBeCalled();
    });

    describe('new values', () => {
      beforeEach(() => {
        jest.spyOn(component, 'clearTimeout');
      });

      afterEach(() => {
        expect(component.show).toBeTruthy();
        expect(component.clearTimeout).toBeCalledTimes(1);
        expect(setTimeout).toBeCalledTimes(1);
      });

      it('should set up timer if changes has new values for header', () => {
        component.ngOnChanges({ header: new SimpleChange('', 'header', true) });
      });

      it('should set up timer if changes has new values for text', () => {
        component.ngOnChanges({ text: new SimpleChange('', 'text', true) });
      });
    });
  });

  describe('clearTimeout', () => {
    it('should do nothing if timeout is null', () => {
      component.clearTimeout();
      expect(clearTimeout).not.toBeCalled();
    });

    it('should call clearTimeout if timeout is not null', () => {
      component.ngOnChanges({ text: new SimpleChange('', 'text', true) });
      component.clearTimeout();
      expect(clearTimeout).toBeCalledTimes(1);
    });
  });

  describe('dismiss', () => {
    it('should call clearTimeout, set show to false, and emit dismissed', () => {
      jest.spyOn(component, 'clearTimeout');
      component.dismiss();
      expect(component.clearTimeout).toBeCalledTimes(1);
      expect(component.show).toBeFalsy();
      expect(component.dismissed.emit).toBeCalledTimes(1);
    });
  });

  describe('onShowChange', () => {
    it('should only call dismiss if show value is false', () => {
      jest.spyOn(component, 'dismiss');
      component.onShowChange(true);
      expect(component.dismiss).not.toBeCalled();
      component.onShowChange(false);
      expect(component.dismiss).toBeCalledTimes(1);
    });
  });
});
