import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * An error message footer to conditionally display errors.
 */
@Component({
  selector: 'newbee-error-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-footer.component.html',
})
export class ErrorFooterComponent {
  /**
   * A string detailing the error text.
   */
  @Input() error = '';

  /**
   * Whether the component should be displayed.
   */
  @Input() displayError = false;
}
