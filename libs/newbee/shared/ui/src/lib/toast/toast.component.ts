import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  ToastXPosition,
  ToastYPosition,
  type Toast,
} from '@newbee/newbee/shared/util';
import { AlertComponent } from '../alert';

/**
 * A simple toast popup component.
 */
@Component({
  selector: 'newbee-toast',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './toast.component.html',
})
export class ToastComponent implements OnInit, OnDestroy {
  /**
   * Whether to show the toast.
   */
  private _show = true;

  /**
   * Getter for `_show`.
   */
  get show(): boolean {
    return this._show;
  }

  /**
   * The timeout for closing the toast, if duration is not null.
   */
  private timeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * The toast to show.
   */
  @Input() toast!: Toast;

  /**
   * Emit to let the parent component know the toast was dismissed, whether by the user or time.
   */
  @Output() dismissed = new EventEmitter<void>();

  /**
   * The classses needed to set up the toast div.
   */
  get toastClasses(): string[] {
    const [x, y] = this.toast.position;
    const result: string[] = ['toast'];

    switch (x) {
      case ToastXPosition.Start:
        result.push('toast-start');
        break;
      case ToastXPosition.Center:
        result.push('toast-center');
        break;
      case ToastXPosition.End:
        result.push('toast-end');
        break;
    }

    switch (y) {
      case ToastYPosition.Top:
        result.push('toast-top');
        break;
      case ToastYPosition.Middle:
        result.push('toast-middle');
        break;
      case ToastYPosition.Bottom:
        result.push('toast-bottom');
        break;
    }

    return result;
  }

  /**
   * Set the timeout for the toast.
   */
  ngOnInit(): void {
    if (!this.toast.header && !this.toast.text) {
      this.dismiss();
      return;
    }

    if (this.toast.duration) {
      this.timeout = setTimeout(() => {
        this.dismiss();
      }, this.toast.duration);
    }
  }

  /**
   * When the component is destroyed, ensure the timeout is cleared.
   */
  ngOnDestroy(): void {
    this.clearTimeout();
  }

  /**
   * Clear `timeout` if it's not null.
   */
  clearTimeout(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  /**
   * Dismiss the toast alert.
   */
  dismiss(): void {
    this._show = false;
    this.clearTimeout();
    this.dismissed.emit();
  }

  /**
   * If the child alert component's show value changes, dismiss the toast if the show value has become false.
   *
   * @param show The new show value.
   */
  onShowChange(show: boolean): void {
    if (!show) {
      this.dismiss();
    }
  }
}
