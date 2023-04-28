import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ignoreMouseEvent } from '@newbee/newbee/shared/util';
import { Subject, takeUntil } from 'rxjs';

/**
 * A custom searchbar input component.
 * Emits what the user is searching as an output.
 */
@Component({
  selector: 'newbee-searchbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './searchbar.component.html',
})
export class SearchbarComponent implements OnInit, OnDestroy {
  /**
   * Whether to include a placeholder saying `Search...`.
   */
  @Input() placeholder = true;

  /**
   * Whether to include the magnifying glass symbol.
   */
  @Input() includeSearchSymbol = true;

  /**
   * Whether to include the x mark symbol.
   */
  @Input() includeClearSymbol = true;

  /**
   * Initial value for the searchbar's value
   */
  @Input() searchTerm = '';

  /**
   * What the user is searching for.
   */
  @Output() searchTermChange = new EventEmitter<string>();

  /**
   * The internal form control for the searchbar input.
   */
  searchbar = new FormControl('');

  /**
   * Used to unsubscribe from infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * Call the method to ignore a fed-in mouse event.
   */
  ignoreMouseEvent = ignoreMouseEvent;

  /**
   * Initialize the searchbar with the value of `searchTerm`.
   */
  ngOnInit(): void {
    this.searchbar.setValue(this.searchTerm, { emitEvent: false });
    this.searchbar.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (value) => {
        this.searchTermChange.emit(value ?? '');
      },
    });
  }

  /**
   * Unsubscribe from infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Clear the searchbar.
   */
  clear(): void {
    this.searchbar.setValue('');
  }
}
