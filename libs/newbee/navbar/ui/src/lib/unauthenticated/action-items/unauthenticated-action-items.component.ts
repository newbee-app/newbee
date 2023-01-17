import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { RouteKeyword } from '@newbee/newbee/navbar/util';

/**
 * The right-hand side of the unauthenticated navbar, which gives the user the option to log in or register.
 */
@Component({
  selector: 'newbee-unauthenticated-action-items',
  templateUrl: './unauthenticated-action-items.component.html',
})
export class UnauthenticatedActionItemsComponent {
  /**
   * An emitter telling the parent component which route to navigate to.
   */
  @Output() navigateToLink = new EventEmitter<RouteKeyword>();

  /**
   * All valid keywords associated to routes.
   */
  readonly routeKeyword = RouteKeyword;

  /**
   * Calls `navigateToLink` emit with the given link.
   * @param link The link to emit.
   */
  emitNavigateToLink(link: RouteKeyword): void {
    this.navigateToLink.emit(link);
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [UnauthenticatedActionItemsComponent],
  exports: [UnauthenticatedActionItemsComponent],
})
export class UnauthenticatedActionItemsComponentModule {}
