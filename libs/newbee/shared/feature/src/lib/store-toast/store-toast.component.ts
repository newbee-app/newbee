import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastActions, toastFeature } from '@newbee/newbee/shared/data-access';
import { ToastComponent } from '@newbee/newbee/shared/ui';
import { Store } from '@ngrx/store';

/**
 * The smart UI component for displaying toast alerts.
 */
@Component({
  selector: 'newbee-store-toast',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './store-toast.component.html',
})
export class StoreToastComponent {
  /**
   * All of the toasts in the store.
   */
  toasts$ = this.store.select(toastFeature.selectToasts);

  constructor(private readonly store: Store) {}

  /**
   * When a toast is dismissed, send a message to the store to remove the toast.
   * @param id The ID of the toast to dismiss.
   */
  onDismissed(id: string): void {
    this.store.dispatch(ToastActions.removeToast({ id }));
  }
}
