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
import { SearchbarComponent } from '@newbee/newbee/shared/ui';
import { BaseQueryResultDto } from '@newbee/shared/data-access';
import { Subject, takeUntil } from 'rxjs';

/**
 * The dumb UI for displaying search results.
 */
@Component({
  selector: 'newbee-search-results',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchbarComponent],
  templateUrl: './search-results.component.html',
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  /**
   * The initial value for the searchbar.
   */
  @Input() initialSearchTerm = '';

  /**
   * Suggestions for the searchbar based on its current value.
   */
  @Input() searchSuggestions: string[] = [];

  /**
   * The search results themselves.
   * TODO: can't be a BaseQueryResultDto bc that's in data-access, fix that.
   */
  @Input() searchResults: BaseQueryResultDto | null = null;

  /**
   * The event emitter that tells the parent component when a search has been fired off.
   */
  @Output() search = new EventEmitter<string>();

  /**
   * The event emitter that tells the parent component when the user has typed into the searchbar, so suggestions can be fetched.
   */
  @Output() searchbar = new EventEmitter<string>();

  /**
   * The event emitter that tells the parent component when the user has changed search tabs, so the results can be filtered.
   */
  @Output() tabChange = new EventEmitter<SearchTab>();

  /**
   * Emits to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * All of the possible values for a search tab.
   */
  readonly searchTab = SearchTab;

  /**
   * The currently selected search tab value.
   */
  selectedTab = SearchTab.All;

  /**
   * The search term coming from the searchbar.
   */
  searchTerm = this.fb.group({ searchbar: ['', [Validators.required]] });

  constructor(private readonly fb: FormBuilder) {}

  /**
   * Sets the value of the searchbar to the initial search term.
   * Also emits the suggest event with the current searchbar value.
   */
  ngOnInit(): void {
    this.searchTerm.setValue({ searchbar: this.initialSearchTerm });

    this.searchTerm.controls.searchbar.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (value) => {
          if (!value) {
            return;
          }

          this.searchbar.emit(value);
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
   * Change the current search tab to filter results.
   *
   * @param tab The new value for the search tab.
   */
  changeTab(tab: SearchTab): void {
    if (this.selectedTab === tab) {
      return;
    }

    this.selectedTab = tab;
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
   * Emits the search event with the current search value.
   */
  emitSearch(): void {
    const searchVal = this.searchTerm.controls.searchbar.value;
    if (!searchVal) {
      return;
    }

    return this.search.emit(searchVal);
  }
}