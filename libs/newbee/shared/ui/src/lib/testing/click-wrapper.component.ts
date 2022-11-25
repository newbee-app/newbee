import { Component, HostListener, NgModule } from '@angular/core';
import { ClickService } from '@newbee/newbee/shared/util';

@Component({
  selector: 'newbee-click-wrapper',
  template: `<div id="click-wrapper"><ng-content></ng-content></div>`,
})
export class ClickWrapperComponent {
  @HostListener('document:click', ['$event.target']) clickEvent(
    target: HTMLElement
  ): void {
    this.clickService.documentClickTarget.next(target);
  }

  constructor(private readonly clickService: ClickService) {}
}

@NgModule({
  declarations: [ClickWrapperComponent],
  exports: [ClickWrapperComponent],
})
export class ClickWrapperComponentModule {}
