import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

/**
 * A dumb UI for displaying a 404 not found error.
 */
@Component({
  selector: 'newbee-not-found-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-found-error.component.html',
})
export class NotFoundErrorComponent {
  /**
   * Tell the smart UI parent to go home.
   */
  @Output() navigateHome = new EventEmitter<void>();
}
