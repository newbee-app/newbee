import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchActions } from '@newbee/newbee/shared/data-access';
import { BaseQueryDto, BaseSuggestDto } from '@newbee/shared/data-access';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

/**
 * The smart UI for the organization home screen.
 */
@Component({
  selector: 'newbee-org-home',
  templateUrl: './org-home.component.html',
})
export class OrgHomeComponent implements OnInit, OnDestroy {
  /**
   * Represents the searchbar's current value, for use in generating suggestions.
   */
  readonly searchTerm$ = new Subject<string>();

  constructor(private readonly store: Store) {}

  /**
   * Set up deboucing on the searchbar to reasonably limit requests to the API.
   */
  ngOnInit(): void {
    this.searchTerm$.pipe(debounceTime(300), distinctUntilChanged()).subscribe({
      next: (searchTerm: string): void => {
        const suggestDto: BaseSuggestDto = { query: searchTerm };
        this.store.dispatch(SearchActions.suggest({ query: suggestDto }));
      },
    });
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.searchTerm$.complete();
  }

  /**
   * When the dumb UI emits a search event, send a search action with the value of the search term.
   *
   * @param searchTerm The value of the search term.
   */
  search(searchTerm: string): void {
    const queryDto: BaseQueryDto = { query: searchTerm, offset: 0 };
    this.store.dispatch(SearchActions.search({ query: queryDto }));
  }

  /**
   * When the dumb UI emits a searchbar event, emit it to the searchTerm$ subject.
   *
   * @param searchTerm The value of the searchbar.
   */
  searchbar(searchTerm: string): void {
    this.searchTerm$.next(searchTerm);
  }
}
