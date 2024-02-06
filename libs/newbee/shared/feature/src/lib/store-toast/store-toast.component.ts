import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ToastActions, toastFeature } from '@newbee/newbee/shared/data-access';
import { ToastComponent } from '@newbee/newbee/shared/ui';
import {
  Toast,
  ToastXPosition,
  ToastYPosition,
} from '@newbee/newbee/shared/util';
import { createArrayOrPush } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

/**
 * The smart UI component for displaying toast alerts.
 */
@Component({
  selector: 'newbee-store-toast',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  templateUrl: './store-toast.component.html',
})
export class StoreToastComponent implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();
  readonly toastXPosition = ToastXPosition;
  readonly toastYPosition = ToastYPosition;

  /**
   * A record that maps all of the possible toast orientations to an array of toasts for the orientation.
   */
  get toasts(): Record<string, Toast[] | undefined> {
    return this._toasts;
  }
  private _toasts: Record<string, Toast[] | undefined> = {};

  constructor(private readonly store: Store) {
    this.store
      .select(toastFeature.selectToasts)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (toasts) => {
          this._toasts = {};
          toasts.forEach((toast) => {
            const {
              position: [xPos, yPos],
            } = toast;
            this._toasts[`${xPos}${yPos}`] = createArrayOrPush(
              toast,
              this._toasts[`${xPos}${yPos}`],
            );
          });
        },
      });
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * When a toast is dismissed, send a message to the store to remove the toast.
   *
   * @param id The ID of the toast to dismiss.
   */
  onDismissed(id: string): void {
    this.store.dispatch(ToastActions.removeToast({ id }));
  }
}
