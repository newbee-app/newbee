import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchTab } from '@newbee/newbee/search/util';
import {
  AlertComponent,
  SearchResultComponent,
  SearchbarComponent,
} from '@newbee/newbee/shared/ui';
import {
  HttpClientError,
  SearchResultFormat,
  getHttpClientErrorMsg,
} from '@newbee/newbee/shared/util';
import { Keyword, type QueryResults } from '@newbee/shared/util';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Subject, takeUntil } from 'rxjs';

/**
 * The dumb UI for displaying search results.
 */
@Component({
  selector: 'newbee-search-results',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    SearchbarComponent,
    SearchResultComponent,
    AlertComponent,
  ],
  templateUrl: './search-results.component.html',
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();
  readonly searchTab = SearchTab;
  readonly searchResultFormat = SearchResultFormat;

  /**
   * The HTTP client error.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The initial value for the searchbar.
   */
  @Input() initialSearchTerm = '';

  /**
   * The currently selected search tab value.
   */
  @Input() tab = SearchTab.All;

  /**
   * The event emitter that tells the parent component when the user has changed search tabs, so the results can be filtered.
   */
  @Output() tabChange = new EventEmitter<SearchTab>();

  /**
   * Suggestions for the searchbar based on its current value.
   */
  @Input() searchSuggestions: string[] = [];

  /**
   * The search results themselves.
   */
  @Input() searchResults: QueryResults | null = null;

  /**
   * Whether to display a loader to indicate a search is occurring.
   */
  @Input() searchPending = false;

  /**
   * Whether to display a loader to indicate that more search results are being fetched.
   */
  @Input() continueSearchPending = false;

  /**
   * The event emitter that tells the parent component when a search has been fired off.
   */
  @Output() search = new EventEmitter<string>();

  /**
   * The event emitter that tells the parent component when the user has typed into the searchbar, so suggestions can be fetched.
   */
  @Output() searchbar = new EventEmitter<string>();

  /**
   * Where to navigate to, relative to the current org.
   */
  @Output() orgNavigate = new EventEmitter<string>();

  /**
   * Indicates that the user has scrolled to the bottom of the search results.
   */
  @Output() scrolled = new EventEmitter<void>();

  /**
   * The search term containing the searchbar.
   */
  searchTerm = this.fb.group({ searchbar: ['', [Validators.required]] });

  /**
   * Emits the searchbar output with the current searchbar value.
   */
  constructor(private readonly fb: FormBuilder) {
    this.searchTerm.controls.searchbar.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (value) => {
          this.searchbar.emit(value ?? '');
        },
      });
  }

  /**
   * Sets the value of the searchbar to the initial search term.
   */
  ngOnInit(): void {
    this.searchTerm.setValue(
      { searchbar: this.initialSearchTerm },
      { emitEvent: false },
    );
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * The number of results that were found, expressed as a string.
   */
  get resultsFound(): string {
    if (!this.searchResults) {
      return 'No results found';
    }

    return `${this.searchResults.total} ${
      this.searchResults.total === 1 ? 'result' : 'results'
    } found`;
  }

  /**
   * Get the misc error in the HTTP client error.
   */
  get miscError(): string {
    return getHttpClientErrorMsg(this.httpClientError, Keyword.Misc);
  }

  /**
   * Change the current search tab to filter results.
   *
   * @param tab The new value for the search tab.
   */
  changeTab(tab: SearchTab): void {
    if (this.tab === tab) {
      return;
    }

    this.tab = tab;
    this.tabChange.emit(tab);
  }

  /**
   * Takes in a suggestion and uses it to fire a search request.
   *
   * @param suggestion The suggestion to use.
   */
  selectSuggestion(suggestion: string): void {
    this.searchTerm.setValue({ searchbar: suggestion });
    this.emitSearch();
  }

  /**
   * Emits the search event with the current searchbar value.
   */
  emitSearch(): void {
    const searchVal = this.searchTerm.controls.searchbar.value;
    if (!searchVal) {
      return;
    }

    return this.search.emit(searchVal);
  }
}
