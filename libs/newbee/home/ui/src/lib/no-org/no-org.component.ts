import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouteAndQueryParams, ShortUrl } from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';

@Component({
  selector: 'newbee-no-org',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-org.component.html',
  styles: [],
})
export class NoOrgComponent {
  readonly keyword = Keyword;
  readonly shortUrl = ShortUrl;

  /**
   * The event emitter that tells the parent component what route to navigate to.
   */
  @Output() navigateToLink = new EventEmitter<RouteAndQueryParams>();
}
