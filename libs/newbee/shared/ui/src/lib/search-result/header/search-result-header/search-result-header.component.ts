import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouteAndQueryParams, ShortUrl } from '@newbee/newbee/shared/util';
import {
  PostSearchResult,
  isDocSearchResult,
  isOrgMemberSearchResult,
  isQnaSearchResult,
  isTeamSearchResult,
  userDisplayName,
  type OrgSearchResultType,
} from '@newbee/shared/util';
import {
  SearchResultTypeBtnComponent,
  UpToDateBtnComponent,
} from '../../../btn';

/**
 * A dumb UI displaying the header of a search result.
 * Indicates the type of the search result and whether it's up-to-date, if relevant.
 */
@Component({
  selector: 'newbee-search-result-header',
  standalone: true,
  imports: [CommonModule, SearchResultTypeBtnComponent, UpToDateBtnComponent],
  templateUrl: './search-result-header.component.html',
})
export class SearchResultHeaderComponent {
  /**
   * The search result to display.
   */
  @Input() searchResult!: OrgSearchResultType;

  /**
   * Where to navigate to, relative to the org.
   */
  @Output() orgNavigate = new EventEmitter<RouteAndQueryParams>();

  /**
   * The search result as a `PostSearchResult` if possible, `null` otherwise.
   */
  get searchResultAsPost(): PostSearchResult | null {
    if (isDocSearchResult(this.searchResult)) {
      return this.searchResult.doc;
    } else if (isQnaSearchResult(this.searchResult)) {
      return this.searchResult.qna;
    }

    return null;
  }

  /**
   * The string that should act as the search result's header.
   */
  get searchResultHeader(): string {
    if (isOrgMemberSearchResult(this.searchResult)) {
      return userDisplayName(this.searchResult.user);
    } else if (isTeamSearchResult(this.searchResult)) {
      return this.searchResult.name;
    } else if (isDocSearchResult(this.searchResult)) {
      return this.searchResult.doc.title;
    } else if (isQnaSearchResult(this.searchResult)) {
      return this.searchResult.qna.title;
    }

    // this should never happen
    return '';
  }

  /**
   * Navigate to the relevant link when the user clicks the header.
   */
  headerClick(): void {
    if (isOrgMemberSearchResult(this.searchResult)) {
      this.orgNavigate.emit({
        route: `${ShortUrl.Member}/${this.searchResult.orgMember.slug}`,
      });
    } else if (isTeamSearchResult(this.searchResult)) {
      this.orgNavigate.emit({
        route: `${ShortUrl.Team}/${this.searchResult.slug}`,
      });
    } else if (isDocSearchResult(this.searchResult)) {
      this.orgNavigate.emit({
        route: `${ShortUrl.Doc}/${this.searchResult.doc.slug}`,
      });
    } else if (isQnaSearchResult(this.searchResult)) {
      this.orgNavigate.emit({
        route: `${ShortUrl.Qna}/${this.searchResult.qna.slug}`,
      });
    }
  }
}
