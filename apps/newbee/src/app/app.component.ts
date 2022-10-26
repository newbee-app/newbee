import { Component, HostListener } from '@angular/core';
import { ClickService } from '@newbee/newbee/shared/util';

@Component({
  selector: 'newbee-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @HostListener('document:click', ['$event.target']) clickEvent(
    target: HTMLElement
  ): void {
    this.clickService.documentClickTarget.next(target);
  }

  constructor(private readonly clickService: ClickService) {}
}
