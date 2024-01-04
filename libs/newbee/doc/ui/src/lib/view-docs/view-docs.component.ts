import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  SearchResultComponent,
  SearchbarComponent,
} from '@newbee/newbee/shared/ui';
import { SearchResultFormat } from '@newbee/newbee/shared/util';
import { QueryResult } from '@newbee/shared/util';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Subject, takeUntil } from 'rxjs';

/**
 * Dumb UI for viewing all of the docs in an org.
 */
@Component({
  selector: 'newbee-view-docs',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    SearchbarComponent,
    SearchResultComponent,
  ],
  templateUrl: './view-docs.component.html',
})
export class ViewDocsComponent implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();
  readonly searchResultFormat = SearchResultFormat;

  /**
   * The docs to display.
   */
  @Input() docs: QueryResult | null = null;

  /**
   * Suggestions for the searchbar based on its current value.
   */
  @Input() searchSuggestions: string[] = [];

  /**
   * The query param containing a search query, if any.
   */
  @Input()
  get searchParam(): string | null {
    return this._searchParam;
  }
  set searchParam(searchParam: string | null) {
    this._searchParam = searchParam;
    this.searchTerm.setValue({ searchbar: searchParam });
  }
  private _searchParam: string | null = null;

  /**
   * Whether to display a spinner on search results.
   */
  @Input() searchPending = false;

  /**
   * Tells the parent component when a search has been fired off.
   */
  @Output() search = new EventEmitter<string>();

  /**
   * Tells the parent component when the user has typed into the searchbar, so suggestions can be fetched.
   */
  @Output() searchbar = new EventEmitter<string>();

  /**
   * The path to navigate to, relative to the currently selected org.
   */
  @Output() orgNavigate = new EventEmitter<string>();

  /**
   * Indicates that the user has scrolled to the bottom of the results.
   */
  @Output() scrolled = new EventEmitter<void>();

  /**
   * The search term containing the searchbar.
   */
  searchTerm = this.fb.group({ searchbar: '' });

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
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * The number of docs that were found, expressed as a string.
   */
  get docsFound(): string {
    if (!this.docs) {
      return 'No docs found';
    }

    return `${this.docs.total} ${this.docs.total === 1 ? 'doc' : 'docs'} found`;
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

  /**
   * When the user clicks on a searchbar suggestion, fire off a search request with that value.
   *
   * @param suggestion The suggestion to use.
   */
  selectSuggestion(suggestion: string): void {
    this.searchTerm.setValue({ searchbar: suggestion });
    this.emitSearch();
  }
}
