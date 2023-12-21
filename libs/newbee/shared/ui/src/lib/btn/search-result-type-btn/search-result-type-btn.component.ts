import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  SolrEntryEnum,
  resultIsDocQueryResult,
  resultIsOrgMemberQueryResult,
  resultIsQnaQueryResult,
  resultIsTeamQueryResult,
  type QueryResultType,
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
  @Input() searchResult!: QueryResultType;

  /**
   * Get the type of the search result as a string.
   */
  get searchResultType(): string {
    if (resultIsOrgMemberQueryResult(this.searchResult)) {
      return capitalize(SolrEntryEnum.User);
    } else if (resultIsTeamQueryResult(this.searchResult)) {
      return capitalize(SolrEntryEnum.Team);
    } else if (resultIsDocQueryResult(this.searchResult)) {
      return capitalize(SolrEntryEnum.Doc);
    } else if (resultIsQnaQueryResult(this.searchResult)) {
      return capitalize(SolrEntryEnum.Qna);
    } else {
      // this should never happen
      return 'Unknown';
    }
  }
}
