import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  HttpScreenError,
  RouteAndQueryParams,
} from '@newbee/newbee/shared/util';
import { Keyword, emailUnverifiedForbiddenError } from '@newbee/shared/util';

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
  readonly emailUnverifiedForbiddenError = emailUnverifiedForbiddenError;

  /**
   * The screen error.
   */
  @Input() httpScreenError: HttpScreenError | null = null;

  /**
   * Navigate to the user page.
   */
  @Output() navigate = new EventEmitter<RouteAndQueryParams>();

  /**
   * Emit navigate with the user route.
   */
  emitNavigateToUser(): void {
    this.navigate.emit({ route: `/${Keyword.User}` });
  }
}
