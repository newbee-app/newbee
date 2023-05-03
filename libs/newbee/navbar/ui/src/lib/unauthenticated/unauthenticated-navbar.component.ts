import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  RouteKeyword,
  unauthenticatedNavbarRoutes,
} from '@newbee/newbee/shared/util';

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
  @Output() navigateToLink = new EventEmitter<RouteKeyword>();

  readonly routeKeyword = RouteKeyword;

  readonly links = unauthenticatedNavbarRoutes;

  /**
   * Calls `navigateToLink.emit()` using the given link.
   *
   * @param link The route to navigate to.
   */
  emitNavigateToLink(link: RouteKeyword) {
    this.navigateToLink.emit(link);
  }
}
