import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { UrlEndpoint } from '@newbee/shared/data-access';

/**
 * The unauthenticated version of the navbar.
 */
@Component({
  selector: 'newbee-unauthenticated-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unauthenticated-navbar.component.html',
})
export class UnauthenticatedNavbarComponent {
  /**
   * The `EventEmitter` that tells the parent component what route to navigate to.
   */
  @Output() navigateToLink = new EventEmitter<string>();

  /**
   * All possible URL endpoints.
   */
  readonly urlEndpoint = UrlEndpoint;

  /**
   * Calls `navigateToLink.emit()` using the given route.
   *
   * @param endpoints The route to navigate to.
   */
  emitNavigateToLink(...endpoints: string[]) {
    this.navigateToLink.emit(`/${endpoints.join('/')}`);
  }
}
