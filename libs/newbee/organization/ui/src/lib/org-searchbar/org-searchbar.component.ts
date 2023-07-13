import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
  searchTerm = new FormControl('', [Validators.required]);

  /**
   * Emits to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * Emit the suggest event with the current searchbar value.
   */
  ngOnInit(): void {
    this.searchTerm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe({
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
   * Emit the search event with the current search value.
   */
  emitSearch(event: SubmitEvent): void {
    event.preventDefault();
    if (!this.searchTerm.value) {
      return;
    }

    this.search.emit(this.searchTerm.value);
  }
}
