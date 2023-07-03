import { Component, Input } from '@angular/core';

/**
 * A simple component that displays a success alert with a little check symbol.
 */
@Component({
  selector: 'newbee-success-alert',
  standalone: true,
  templateUrl: './success-alert.component.html',
})
export class SuccessAlertComponent {
  /**
   * A string detailing the success text.
   */
  @Input() text = '';
}
