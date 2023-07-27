import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
  @Input() type: 'info' | 'success' | 'warning' | 'error' = 'error';

  /**
   * Where to show the toast.
   */
  @Input() position: ['top' | 'middle' | 'bottom', 'start' | 'center' | 'end'] =
    ['bottom', 'center'];

  /**
   * How long the toast should stay on the screen, in ms.
   * `null` will ensure it will stay on the screen until the user dismisses it manually.
   */
  @Input() duration: number | null = null;

  /**
   * The classses needed to set up the toast div.
   */
  get toastClasses(): string[] {
    const [y, x] = this.position;
    const result: string[] = ['toast'];

    switch (y) {
      case 'top':
        result.push('toast-top');
        break;
      case 'middle':
        result.push('toast-middle');
        break;
      case 'bottom':
        result.push('toast-bottom');
        break;
    }

    switch (x) {
      case 'start':
        result.push('toast-start');
        break;
      case 'center':
        result.push('toast-center');
        break;
      case 'end':
        result.push('toast-end');
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
