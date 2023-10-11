import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchTab, serachTabToSolrEntry } from '@newbee/newbee/search/util';
import {
  SearchActions,
  searchFeature,
} from '@newbee/newbee/shared/data-access';
import { Keyword, QueryResult, SolrEntryEnum } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

/**
 * The smart UI for displaying search results.
 */
@Component({
  selector: 'newbee-search-results-view',
  templateUrl: './search-results-view.component.html',
})
export class SearchResultsViewComponent implements OnDestroy {
  /**
   * Emit to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * Suggestions for the searchbar.
   */
  searchSuggestions$ = this.store.select(searchFeature.selectSuggestions);

  /**
   * Whether the search action is currently pending.
   */
  searchPending$ = this.store.select(searchFeature.selectPendingSearch);

  /**
   * The search tab the user has selected.
   */
  tab = SearchTab.All;

  /**
   * The search term the search results are about.
   */
  searchTerm = '';

  /**
   * The results of the search query.
   */
  searchResults: QueryResult | null = null;

  /**
   * Subscribe to the route's search param and the store's value for the search results.
   */
  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (paramMap) => {
        this.searchTerm = paramMap.get(Keyword.Search) ?? '';
      },
    });

    store
      .select(searchFeature.selectSearchResult)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (result) => {
          this.searchResults = result;
        },
      });
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Get the component's `tab` as a `SolrEntryEnum`, or `null` if `tab` is on `All`.
   */
  get tabAsSolrEntry(): SolrEntryEnum | null {
    return serachTabToSolrEntry(this.tab);
  }

  /**
   * When the user changes the search tab, dispatch a new search request.
   *
   * @param tab The new value for the search tab.
   */
  onTabChange(tab: SearchTab): void {
    this.tab = tab;
    this.store.dispatch(
      SearchActions.search({
        query: {
          offset: 0,
          query: this.searchTerm,
          ...(this.tabAsSolrEntry && { type: this.tabAsSolrEntry }),
        },
      }),
    );
  }

  /**
   * If the user submits a new search request, navigate to the route associated with the request.
   *
   * @param query The search term.
   */
  async onSearch(query: string): Promise<void> {
    await this.router.navigate([`../${query}`], { relativeTo: this.route });
  }

  /**
   * Makes the request to generate new suggestions whenever the user updates the searchbar.
   *
   * @param query The new value of the searchbar.
   */
  onSearchbar(query: string): void {
    this.store.dispatch(SearchActions.suggest({ query: { query } }));
  }

  /**
   * Navigate to the given path, relative to the current org.
   *
   * @param path The path to navigate to, relative to the current org.
   */
  async onOrgNavigate(path: string): Promise<void> {
    await this.router.navigate([`../../${path}`], { relativeTo: this.route });
  }

  /**
   * When the user navigates to the bottom of the search results, fetch more.
   */
  onScrolled(): void {
    if (!this.searchResults) {
      return;
    } else if (
      this.searchResults.total <=
      10 * (this.searchResults.offset + 1)
    ) {
      return;
    }

    this.store.dispatch(
      SearchActions.search({
        query: {
          offset: this.searchResults.offset + 1,
          query: this.searchTerm,
          ...(this.tabAsSolrEntry && { type: this.tabAsSolrEntry }),
        },
      }),
    );
  }
}
