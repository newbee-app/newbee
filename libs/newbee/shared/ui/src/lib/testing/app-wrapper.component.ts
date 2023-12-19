import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ClickService, PortalService } from '@newbee/newbee/shared/util';

/**
 * A wrapper component that acts as a provider for the global `ClickService` and `PortalService`.
 * Strictly for use in testing, including Storybook.
 */
@Component({
  selector: 'newbee-app-wrapper',
  standalone: true,
  imports: [CommonModule, PortalModule],
  template: ` <div id="app-wrapper">
    <ng-container *ngFor="let portal of portals$ | async">
      <ng-template [cdkPortalOutlet]="portal"></ng-template>
    </ng-container>

    <ng-content></ng-content>
  </div>`,
})
export class AppWrapperComponent {
  @HostListener('document:click', ['$event.target'])
  clickEvent(target: HTMLElement): void {
    this.clickService.documentClickTarget$.next(target);
  }

  readonly portals$ = this.portalService.portals$;

  constructor(
    private readonly clickService: ClickService,
    private readonly portalService: PortalService,
  ) {}
}
