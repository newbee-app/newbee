import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouteAndQueryParams } from '@newbee/newbee/shared/util';

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
  @Output() navigate = new EventEmitter<RouteAndQueryParams>();
}
