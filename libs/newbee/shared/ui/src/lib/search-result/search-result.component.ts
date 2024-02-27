import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  RouteAndQueryParams,
  SearchResultFormat,
} from '@newbee/newbee/shared/util';
import {
  DocSearchResult,
  OrgMemberSearchResult,
  QnaSearchResult,
  TeamRoleEnum,
  TeamSearchResult,
  isDocSearchResult,
  isOrgMemberSearchResult,
  isQnaSearchResult,
  isTeamSearchResult,
  type OrgSearchResultType,
} from '@newbee/shared/util';
import { DocSearchResultComponent } from './doc-search-result';
import { MemberSearchResultComponent } from './member-search-result';
import { QnaSearchResultComponent } from './qna-search-result';
import { TeamSearchResultComponent } from './team-search-result';

/**
 * Dumb UI for displaying a search result.
 * Takes is any type of search result and alters the display depending on the type.
 */
@Component({
  selector: 'newbee-search-result',
  standalone: true,
  imports: [
    CommonModule,
    MemberSearchResultComponent,
    TeamSearchResultComponent,
    DocSearchResultComponent,
    QnaSearchResultComponent,
  ],
  templateUrl: './search-result.component.html',
})
export class SearchResultComponent {
  /**
   * The search result to display.
   */
  @Input() searchResult!: OrgSearchResultType;

  /**
   * Format for how to display the search result, if relevant.
   */
  @Input() format = SearchResultFormat.List;

  /**
   * A team role to display, if relevant.
   */
  @Input() teamRole: TeamRoleEnum | null = null;

  /**
   * Where to navigate to, relative to the current org.
   */
  @Output() orgNavigate = new EventEmitter<RouteAndQueryParams>();

  /**
   * The search result as an `OrgMemberSearchResult` if applicable, `null` otherwise.
   */
  get searchResultAsOrgMember(): OrgMemberSearchResult | null {
    if (isOrgMemberSearchResult(this.searchResult)) {
      return this.searchResult;
    }

    return null;
  }

  /**
   * The search result as an `TeamSearchResult` if applicable, `null` otherwise.
   */
  get searchResultAsTeam(): TeamSearchResult | null {
    if (isTeamSearchResult(this.searchResult)) {
      return this.searchResult;
    }

    return null;
  }

  /**
   * The search result as an `DocSearchResult` if applicable, `null` otherwise.
   */
  get searchResultAsDoc(): DocSearchResult | null {
    if (isDocSearchResult(this.searchResult)) {
      return this.searchResult;
    }

    return null;
  }

  /**
   * The search result as an `QnaSearchResult` if applicable, `null` otherwise.
   */
  get searchResultAsQna(): QnaSearchResult | null {
    if (isQnaSearchResult(this.searchResult)) {
      return this.searchResult;
    }

    return null;
  }
}
