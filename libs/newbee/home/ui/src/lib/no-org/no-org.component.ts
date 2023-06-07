import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { UrlEndpoint } from '@newbee/shared/data-access';

@Component({
  selector: 'newbee-no-org',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-org.component.html',
  styles: [],
})
export class NoOrgComponent {
  /**
   * The event emitter that tells the parent component what route to navigate to.
   */
  @Output() navigateToLink = new EventEmitter<string>();

  /**
   * All NewBee endpoints.
   */
  readonly urlEndpoint = UrlEndpoint;

  /**
   * Calls `navigateToLink.emit()` using the given routes, joined by backslashes.
   *
   * @param endpoints The endpoints of the route to navigate to.
   */
  emitNavigateToLink(...endpoints: string[]): void {
    this.navigateToLink.emit(`/${endpoints.join('/')}`);
  }
}
