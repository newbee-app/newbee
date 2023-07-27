import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * A simple component that displays an alert.
 */
@Component({
  selector: 'newbee-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  /**
   * A string detailing the alert header.
   */
  @Input() header = '';

  /**
   * A string detailing the alert text.
   */
  @Input() text = '';

  /**
   * The type of the alert, `error` by default.
   */
  @Input() type: 'info' | 'success' | 'warning' | 'error' = 'error';

  /**
   * Whether to show a x symbol to clear the alert, defaults to `false`.
   */
  @Input() includeClearSymbol = false;

  /**
   * Whether to show the alert.
   */
  @Input() show = true;

  /**
   * Emits any changes to `show`.
   */
  @Output() showChange = new EventEmitter<boolean>();

  /**
   * The alert type for use in the div's class.
   */
  get alertType(): string {
    // NOTE: half-string, half-variable does not work, so we must use switch
    // i.e. `alert-${this.type}` does not work
    switch (this.type) {
      case 'info':
        return 'alert-info';
      case 'success':
        return 'alert-success';
      case 'warning':
        return 'alert-warning';
      case 'error':
        return 'alert-error';
    }
  }

  /**
   * Hide the alert.
   */
  hide(): void {
    this.show = false;
    this.showChange.emit(false);
  }
}
