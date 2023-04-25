import { Component, HostListener } from '@angular/core';
import { ClickService } from '@newbee/newbee/shared/util';

/**
 * A wrapper component that acts as a provider for the global `ClickService`.
 * Strictly for use in testing, including Storybook.
 */
@Component({
  selector: 'newbee-click-wrapper',
  standalone: true,
  template: `<div id="click-wrapper"><ng-content></ng-content></div>`,
})
export class ClickWrapperComponent {
  @HostListener('document:click', ['$event.target'])
  clickEvent(target: HTMLElement): void {
    this.clickService.documentClickTarget.next(target);
  }

  constructor(private readonly clickService: ClickService) {}
}
