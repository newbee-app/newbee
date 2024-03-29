import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouteAndQueryParams, ShortUrl } from '@newbee/newbee/shared/util';
import {
  PostQueryResult,
  resultIsDocQueryResult,
  resultIsOrgMemberQueryResult,
  resultIsQnaQueryResult,
  resultIsTeamQueryResult,
  userDisplayName,
  type QueryResultType,
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
  @Input() searchResult!: QueryResultType;

  /**
   * Where to navigate to, relative to the org.
   */
  @Output() orgNavigate = new EventEmitter<RouteAndQueryParams>();

  /**
   * The search result as a `PostQueryResult` if possible, `null` otherwise.
   */
  get searchResultAsPost(): PostQueryResult | null {
    if (resultIsDocQueryResult(this.searchResult)) {
      return this.searchResult.doc;
    } else if (resultIsQnaQueryResult(this.searchResult)) {
      return this.searchResult.qna;
    }

    return null;
  }

  /**
   * The string that should act as the search result's header.
   */
  get searchResultHeader(): string {
    if (resultIsOrgMemberQueryResult(this.searchResult)) {
      return userDisplayName(this.searchResult.user);
    } else if (resultIsTeamQueryResult(this.searchResult)) {
      return this.searchResult.name;
    } else if (resultIsDocQueryResult(this.searchResult)) {
      return this.searchResult.doc.title;
    } else if (resultIsQnaQueryResult(this.searchResult)) {
      return this.searchResult.qna.title;
    }

    // this should never happen
    return '';
  }

  /**
   * Navigate to the relevant link when the user clicks the header.
   */
  headerClick(): void {
    if (resultIsOrgMemberQueryResult(this.searchResult)) {
      this.orgNavigate.emit({
        route: `${ShortUrl.Member}/${this.searchResult.orgMember.slug}`,
      });
    } else if (resultIsTeamQueryResult(this.searchResult)) {
      this.orgNavigate.emit({
        route: `${ShortUrl.Team}/${this.searchResult.slug}`,
      });
    } else if (resultIsDocQueryResult(this.searchResult)) {
      this.orgNavigate.emit({
        route: `${ShortUrl.Doc}/${this.searchResult.doc.slug}`,
      });
    } else if (resultIsQnaQueryResult(this.searchResult)) {
      this.orgNavigate.emit({
        route: `${ShortUrl.Qna}/${this.searchResult.qna.slug}`,
      });
    }
  }
}
