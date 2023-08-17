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
import { SearchbarComponent } from '@newbee/newbee/shared/ui';
import { Subject, takeUntil } from 'rxjs';

/**
 * The home screen of an org.
 */
@Component({
  selector: 'newbee-org-searchbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchbarComponent],
  templateUrl: './org-searchbar.component.html',
})
export class OrgSearchbarComponent implements OnInit, OnDestroy {
  /**
   * Whether to display the spinner on the search button.
   */
  @Input() searchPending = false;

  /**
   * Suggestions based on the user's search term.
   */
  @Input() suggestions: string[] = [];

  /**
   * The event emitter that tells the parent component when a search has been fired off.
   */
  @Output() search = new EventEmitter<string>();

  /**
   * The event emitter that tells the parent component when the user has typed into the searchbar, so suggestions can be fetched.
   */
  @Output() searchbar = new EventEmitter<string>();

  /**
   * The search term coming from the searchbar.
   */
  searchTerm = this.fb.group({ searchbar: ['', [Validators.required]] });

  /**
   * Emits to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  constructor(private readonly fb: FormBuilder) {}

  /**
   * Emit the suggest event with the current searchbar value.
   */
  ngOnInit(): void {
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
   * Takes in a suggestion and uses it to fire a search request.
   *
   * @param suggestion The suggestion to use.
   */
  selectSuggestion(suggestion: string): void {
    this.searchTerm.controls.searchbar.setValue(suggestion);
    this.emitSearch();
  }

  /**
   * Emit the search event with the current search value.
   */
  emitSearch(): void {
    const searchVal = this.searchTerm.controls.searchbar.value;
    if (!searchVal) {
      return;
    }

    this.search.emit(searchVal);
  }
}
