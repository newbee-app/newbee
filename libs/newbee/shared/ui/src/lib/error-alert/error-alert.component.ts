import { Component, Input } from '@angular/core';

/**
 * An extremely simple component that displays an error alert with a little error symbol.
 */
@Component({
  selector: 'newbee-error-alert',
  standalone: true,
  imports: [],
  templateUrl: './error-alert.component.html',
})
export class ErrorAlertComponent {
  /**
   * A string detailing the error text.
   */
  @Input() text = '';
}
