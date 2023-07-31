import type { Toast } from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { createActionGroup, props } from '@ngrx/store';

/**
 * All actions tied to toasts.
 */
export const ToastActions = createActionGroup({
  source: Keyword.Toast,
  events: {
    /**
     * Add a toast to display.
     */
    'Add Toast': props<{ toast: Toast | Toast[] }>(),

    /**
     * Remove a toast from display using its UUID.
     */
    'Remove Toast': props<{ id: string }>(),
  },
});
