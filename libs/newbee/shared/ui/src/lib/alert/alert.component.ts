import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertType, Button } from '@newbee/newbee/shared/util';

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
  @Input() type: AlertType = AlertType.Error;

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
   * Displays a custom button in the alert that performs the fed-in click functionality.
   */
  @Input() customButton: Button | null = null;

  /**
   * The alert type for use in the div's class.
   */
  get alertType(): string {
    // NOTE: half-string, half-variable does not work, so we must use switch
    // i.e. `alert-${this.type}` does not work
    switch (this.type) {
      case AlertType.Info:
        return 'alert-info';
      case AlertType.Success:
        return 'alert-success';
      case AlertType.Warning:
        return 'alert-warning';
      case AlertType.Error:
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
