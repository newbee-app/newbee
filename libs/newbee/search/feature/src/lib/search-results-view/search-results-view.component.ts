import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SearchTab,
  searchTabToSolrEntry,
  solrEntryToSearchTab,
} from '@newbee/newbee/search/util';
import {
  SearchActions,
  searchFeature,
} from '@newbee/newbee/shared/data-access';
import { Keyword, SolrEntryEnum, defaultLimit } from '@newbee/shared/util';
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
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * The search state.
   */
  searchState$ = this.store.select(searchFeature.selectSearchState);

  /**
   * The search tab the user has selected.
   */
  get tab(): SearchTab {
    return this._tab;
  }
  private _tab = SearchTab.All;

  /**
   * The current value of `_tab` as a Solr entry enum.
   */
  get type(): SolrEntryEnum | null {
    return searchTabToSolrEntry(this._tab);
  }

  /**
   * The search term the search results are about.
   */
  get searchTerm(): string {
    return this._searchTerm;
  }
  private _searchTerm = '';

  /**
   * Subscribe to the route's search param and type query param.
   */
  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (paramMap) => {
        this._searchTerm = paramMap.get(Keyword.Search) ?? '';
      },
    });

    route.queryParamMap.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (queryParamMap) => {
        const entryType = queryParamMap.get(Keyword.Type);
        this._tab =
          entryType && Object.values<string>(SolrEntryEnum).includes(entryType)
            ? solrEntryToSearchTab(entryType as SolrEntryEnum | null)
            : SearchTab.All;
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
   * When the user changes the search tab, add the corresponding entry type to the query params of the current route.
   * Because only the query params change, this does not trigger actual navigation, so we have to dispatch a new search action.
   *
   * @param tab The new value for the search tab.
   */
  async onTabChange(tab: SearchTab): Promise<void> {
    const type = searchTabToSolrEntry(tab);
    this.store.dispatch(
      SearchActions.search({
        query: {
          offset: 0,
          limit: defaultLimit,
          query: this._searchTerm,
          ...(type && { type }),
        },
      }),
    );
    await this.router.navigate(['.'], {
      relativeTo: this.route,
      ...(type && { queryParams: { [Keyword.Type]: type } }),
    });
  }

  /**
   * If the user submits a new search request, navigate to the corresponding route.
   *
   * @param query The search term.
   */
  async onSearch(query: string): Promise<void> {
    await this.router.navigate([`../${query}`], {
      relativeTo: this.route,
      ...(this.type && { queryParams: { [Keyword.Type]: this.type } }),
    });
  }

  /**
   * Makes the request to generate new suggestions whenever the user updates the searchbar.
   *
   * @param query The new value of the searchbar.
   */
  onSearchbar(query: string): void {
    this.store.dispatch(
      SearchActions.suggest({
        query: { query, ...(this.type && { type: this.type }) },
      }),
    );
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
    this.store.dispatch(SearchActions.continueSearch());
  }
}
