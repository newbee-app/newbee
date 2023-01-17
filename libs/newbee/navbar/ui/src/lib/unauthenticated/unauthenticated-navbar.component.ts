import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { RouteKeyword } from '@newbee/newbee/navbar/util';
import { UnauthenticatedActionItemsComponentModule } from './action-items/unauthenticated-action-items.component';
import { UnauthenticatedNavigationComponentModule } from './navigation/unauthenticated-navigation.component';

/**
 * The unauthenticated version of the navbar.
 */
@Component({
  selector: 'newbee-unauthenticated-navbar',
  templateUrl: './unauthenticated-navbar.component.html',
})
export class UnauthenticatedNavbarComponent {
  /**
   * The `EventEmitter` that tells the parent component what route to navigate to.
   */
  @Output() navigateToLink = new EventEmitter<RouteKeyword>();

  /**
   * Calls `navigateToLink.emit()` using the given link.
   *
   * @param link The route to navigate to.
   */
  emitNavigateToLink(link: RouteKeyword) {
    this.navigateToLink.emit(link);
  }
}

@NgModule({
  imports: [
    CommonModule,
    UnauthenticatedActionItemsComponentModule,
    UnauthenticatedNavigationComponentModule,
  ],
  declarations: [UnauthenticatedNavbarComponent],
  exports: [UnauthenticatedNavbarComponent],
})
export class UnauthenticatedNavbarComponentModule {}
