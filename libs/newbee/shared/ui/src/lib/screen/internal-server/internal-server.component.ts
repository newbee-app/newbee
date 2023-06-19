import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { internalServerError } from '@newbee/shared/util';

/**
 * A dumb UI for displaying a 500 internal server error.
 */
@Component({
  selector: 'newbee-internal-server',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './internal-server.component.html',
})
export class InternalServerComponent {
  /**
   * The text to display for an internal server error.
   */
  readonly internalServerError = internalServerError;
}
