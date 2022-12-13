import { Component, HostListener } from '@angular/core';
import { ClickService } from '@newbee/newbee/shared/util';

/**
 * The global component for the app, which hosts the `<router-outlet>` to project all other UI components.
 */
@Component({
  selector: 'newbee-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  /**
   * Sends out click events for use by other portions of the app.
   * Set at the global document scope and only set up once here to prevent performance issues from multiple host listeners trying to do the same thing.
   *
   * @param target The target of the click event.
   */
  @HostListener('document:click', ['$event.target'])
  clickEvent(target: HTMLElement): void {
    this.clickService.documentClickTarget.next(target);
  }

  constructor(private readonly clickService: ClickService) {}
}
