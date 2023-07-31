import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AlertType,
  ToastXPosition,
  ToastYPosition,
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
export class ToastComponent implements OnChanges {
  /**
   * Whether to show the toast.
   */
  private _show = false;

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
   * A string detailing the alert header.
   */
  @Input() header = '';

  /**
   * A string detailing the alert text.
   */
  @Input() text = '';

  /**
   * The type of alert to use for the toast, `error` by default.
   */
  @Input() type: AlertType = AlertType.Error;

  /**
   * Where to show the toast.
   */
  @Input() position: [ToastXPosition, ToastYPosition] = [
    ToastXPosition.Center,
    ToastYPosition.Bottom,
  ];

  /**
   * How long the toast should stay on the screen, in ms.
   * `null` will ensure it will stay on the screen until the user dismisses it manually.
   */
  @Input() duration: number | null = null;

  /**
   * Emit to let the parent component know the toast was dismissed, whether by the user or time.
   */
  @Output() dismissed = new EventEmitter<void>();

  /**
   * The classses needed to set up the toast div.
   */
  get toastClasses(): string[] {
    const [x, y] = this.position;
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
   * If the header or text is changed, set the timeout
   * @param changes The changes to the toast component's inputs.
   */
  ngOnChanges(changes: SimpleChanges): void {
    const header = changes['header'];
    const text = changes['text'];
    if (!header?.currentValue && !text?.currentValue) {
      return;
    }

    this._show = true;
    this.clearTimeout();
    if (this.duration) {
      this.timeout = setTimeout(() => {
        this.dismiss();
      }, this.duration);
    }
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
    this.clearTimeout();
    this._show = false;
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
