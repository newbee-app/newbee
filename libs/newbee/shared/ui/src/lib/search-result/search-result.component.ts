import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  RouteAndQueryParams,
  SearchResultFormat,
} from '@newbee/newbee/shared/util';
import {
  DocQueryResult,
  OrgMemberQueryResult,
  QnaQueryResult,
  TeamQueryResult,
  TeamRoleEnum,
  resultIsDocQueryResult,
  resultIsOrgMemberQueryResult,
  resultIsQnaQueryResult,
  resultIsTeamQueryResult,
  type QueryResultType,
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
  @Input() searchResult!: QueryResultType;

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
   * The search result as an `OrgMemberQueryResult` if applicable, `null` otherwise.
   */
  get searchResultAsOrgMember(): OrgMemberQueryResult | null {
    if (resultIsOrgMemberQueryResult(this.searchResult)) {
      return this.searchResult;
    }

    return null;
  }

  /**
   * The search result as an `TeamQueryResult` if applicable, `null` otherwise.
   */
  get searchResultAsTeam(): TeamQueryResult | null {
    if (resultIsTeamQueryResult(this.searchResult)) {
      return this.searchResult;
    }

    return null;
  }

  /**
   * The search result as an `DocQueryResult` if applicable, `null` otherwise.
   */
  get searchResultAsDoc(): DocQueryResult | null {
    if (resultIsDocQueryResult(this.searchResult)) {
      return this.searchResult;
    }

    return null;
  }

  /**
   * The search result as an `QnaQueryResult` if applicable, `null` otherwise.
   */
  get searchResultAsQna(): QnaQueryResult | null {
    if (resultIsQnaQueryResult(this.searchResult)) {
      return this.searchResult;
    }

    return null;
  }
}
