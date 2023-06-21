import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { forbiddenError } from '@newbee/shared/util';

/**
 * A dumb UI for displaying a 403 forbidden error.
 */
@Component({
  selector: 'newbee-forbidden-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forbidden-error.component.html',
})
export class ForbiddenErrorComponent {
  /**
   * The text to display for a forbidden error.
   */
  readonly forbiddenError = forbiddenError;
}
