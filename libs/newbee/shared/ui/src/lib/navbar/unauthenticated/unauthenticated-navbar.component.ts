import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ShortUrl } from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';

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
   * All NewBee keywords.
   */
  readonly keyword = Keyword;

  /**
   * All NewBee short URLs.
   */
  readonly shortUrl = ShortUrl;

  /**
   * Calls `navigateToLink.emit()` using the given route.
   *
   * @param endpoints The route to navigate to.
   */
  emitNavigateToLink(...endpoints: string[]) {
    this.navigateToLink.emit(`/${endpoints.join('/')}`);
  }
}
