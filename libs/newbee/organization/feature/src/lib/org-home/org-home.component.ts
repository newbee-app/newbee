import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SearchActions,
  searchFeature,
} from '@newbee/newbee/shared/data-access';
import { Keyword } from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI for the organization home screen.
 */
@Component({
  selector: 'newbee-org-home',
  templateUrl: './org-home.component.html',
})
export class OrgHomeComponent {
  /**
   * Whether the search action is pending.
   */
  searchPending$ = this.store.select(searchFeature.selectPendingSearch);

  /**
   * Whether the suggest action is pending.
   */
  suggestPending$ = this.store.select(searchFeature.selectPendingSuggest);

  /**
   * Suggestions based on the user's search term.
   */
  suggestions$ = this.store.select(searchFeature.selectSuggestions);

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  /**
   * When the dumb UI emits a search event, send a search action with the value of the search term.
   *
   * @param searchTerm The value of the search term.
   */
  async onSearch(searchTerm: string): Promise<void> {
    await this.router.navigate([`${Keyword.Search}/${searchTerm}`], {
      relativeTo: this.route,
    });
  }

  /**
   * When the dumb UI emits a searchbar event, emit it to the searchTerm$ subject.
   *
   * @param searchTerm The value of the searchbar.
   */
  onSearchbar(searchTerm: string): void {
    this.store.dispatch(
      SearchActions.suggest({ query: { query: searchTerm } })
    );
  }
}
