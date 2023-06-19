import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { forbiddenError } from '@newbee/shared/util';

/**
 * A dumb UI for displaying a 403 forbidden error.
 */
@Component({
  selector: 'newbee-forbidden',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forbidden.component.html',
})
export class ForbiddenComponent {
  /**
   * The text to display for a forbidden error.
   */
  readonly forbiddenError = forbiddenError;
}
