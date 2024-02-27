import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  SolrOrgEntryEnum,
  isDocSearchResult,
  isOrgMemberSearchResult,
  isQnaSearchResult,
  isTeamSearchResult,
  type OrgSearchResultType,
} from '@newbee/shared/util';
import { capitalize } from 'lodash-es';
import { TextTooltipComponent } from '../../tooltip';

/**
 * A dumb UI for showing the type of a search result in a button.
 */
@Component({
  selector: 'newbee-search-result-type-btn',
  standalone: true,
  imports: [CommonModule, TextTooltipComponent],
  templateUrl: './search-result-type-btn.component.html',
})
export class SearchResultTypeBtnComponent {
  /**
   * The search result to create a button for.
   */
  @Input() searchResult!: OrgSearchResultType;

  /**
   * Get the type of the search result as a string.
   */
  get searchResultType(): string {
    if (isOrgMemberSearchResult(this.searchResult)) {
      return capitalize(SolrOrgEntryEnum.User);
    } else if (isTeamSearchResult(this.searchResult)) {
      return capitalize(SolrOrgEntryEnum.Team);
    } else if (isDocSearchResult(this.searchResult)) {
      return capitalize(SolrOrgEntryEnum.Doc);
    } else if (isQnaSearchResult(this.searchResult)) {
      return capitalize(SolrOrgEntryEnum.Qna);
    } else {
      // this should never happen
      return 'Unknown';
    }
  }
}
