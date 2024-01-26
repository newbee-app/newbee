import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouteAndQueryParams, ShortUrl } from '@newbee/newbee/shared/util';
import {
  DocQueryResult,
  QnaQueryResult,
  maintainerIsCreator,
  resultIsDocQueryResult,
  resultIsQnaQueryResult,
  userDisplayName,
} from '@newbee/shared/util';
import { SearchResultHeaderComponent } from '../search-result-header';

/**
 * The dumb UI for displaying a search result's header (post title, maintainer, whether it's up-to-date).
 */
@Component({
  selector: 'newbee-post-search-result-header',
  standalone: true,
  imports: [CommonModule, SearchResultHeaderComponent],
  templateUrl: './post-search-result-header.component.html',
})
export class PostSearchResultHeaderComponent {
  /**
   * All of the possible short URLs.
   */
  readonly shortUrl = ShortUrl;

  /**
   * Helper function to get user's display name.
   */
  readonly userDisplayName = userDisplayName;

  /**
   * The post the search result is about.
   */
  @Input() searchResult!: DocQueryResult | QnaQueryResult;

  /**
   * Where we should navigate to, relative to the current org.
   */
  @Output() orgNavigate = new EventEmitter<RouteAndQueryParams>();

  /**
   * Whether the maintainer is the same org member as the creator.
   */
  get maintainerIsCreator(): boolean {
    return maintainerIsCreator(this.searchResult);
  }

  /**
   * Navigate to the displayed post relative to the current org.
   */
  postNavigate(): void {
    if (resultIsDocQueryResult(this.searchResult)) {
      this.orgNavigate.emit({
        route: [ShortUrl.Doc, this.searchResult.doc.slug].join('/'),
      });
    } else if (resultIsQnaQueryResult(this.searchResult)) {
      this.orgNavigate.emit({
        route: [ShortUrl.Qna, this.searchResult.qna.slug].join('/'),
      });
    }
  }
}
