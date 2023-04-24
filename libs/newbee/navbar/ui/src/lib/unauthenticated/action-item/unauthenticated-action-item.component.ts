import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { RouteKeyword } from '@newbee/newbee/navbar/util';

/**
 * The right-hand side of the unauthenticated navbar, which gives the user the option to log in or register.
 */
@Component({
  selector: 'newbee-unauthenticated-action-item',
  templateUrl: './unauthenticated-action-item.component.html',
})
export class UnauthenticatedActionItemComponent {
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
  declarations: [UnauthenticatedActionItemComponent],
  exports: [UnauthenticatedActionItemComponent],
})
export class UnauthenticatedActionItemComponentModule {}
