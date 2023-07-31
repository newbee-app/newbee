import { testToast1 } from '@newbee/newbee/shared/util';
import { ToastActions } from './toast.actions';
import { initialToastState, toastFeature, ToastState } from './toast.reducer';

describe('ToastReducer', () => {
  const stateAfterAddToast: ToastState = {
    toasts: [testToast1],
  };

  describe('from initial state', () => {
    it('should update state for addToast', () => {
      let updatedState = toastFeature.reducer(
        initialToastState,
        ToastActions.addToast({ toast: testToast1 })
      );
      expect(updatedState).toEqual(stateAfterAddToast);

      updatedState = toastFeature.reducer(
        initialToastState,
        ToastActions.addToast({ toast: [testToast1] })
      );
      expect(updatedState).toEqual(stateAfterAddToast);
    });
  });

  describe('from altered state', () => {
    it('should update state for removeToast', () => {
      const updatedState = toastFeature.reducer(
        initialToastState,
        ToastActions.removeToast({ id: testToast1.id })
      );
      expect(updatedState).toEqual(initialToastState);
    });
  });
});
