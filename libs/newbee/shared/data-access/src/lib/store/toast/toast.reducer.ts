import type { Toast } from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ToastActions } from './toast.actions';

/**
 * The piece of state holding toast information that's useful app-wide.
 */
export interface ToastState {
  /**
   * The toasts that are currently being displayed.
   */
  toasts: Toast[];
}

/**
 * The initial value for `ToastState`.
 */
export const initialToastState: ToastState = {
  toasts: [],
};

/**
 * The reducers and generated selectors for `ToastState`.
 */
export const toastFeature = createFeature({
  name: Keyword.Toast,
  reducer: createReducer(
    initialToastState,
    on(
      ToastActions.addToast,
      (state, { toast }): ToastState => ({
        toasts: [...state.toasts, ...(Array.isArray(toast) ? toast : [toast])],
      })
    ),
    on(
      ToastActions.removeToast,
      (state, { id }): ToastState => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      })
    )
  ),
});
