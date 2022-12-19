import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

/**
 * A custom searchbar input component.
 * Emits what the user is searching as an output.
 */
@Component({
  selector: 'newbee-searchbar',
  templateUrl: './searchbar.component.html',
})
export class SearchbarComponent implements OnInit, OnDestroy {
  /**
   * Whether to include a border around the input.
   */
  @Input() border = true;

  /**
   * Whether to include a placeholder saying `Search...`.
   */
  @Input() placeholder = true;

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
  unsubscribe$ = new Subject<void>();

  constructor() {
    this.searchbar.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (value) => {
        this.searchTermChange.emit(value ?? '');
      },
    });
  }

  /**
   * Initialize the searchbar with the value of `searchTerm`.
   */
  ngOnInit(): void {
    this.searchbar.setValue(this.searchTerm, { emitEvent: false });
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

  /**
   * Actively ignore the fed-in mouse event.
   *
   * @param event The mouse event to ignore.
   */
  ignoreMouseEvent(event: MouseEvent): void {
    event.preventDefault();
  }
}

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [SearchbarComponent],
  exports: [SearchbarComponent],
})
export class SearchbarComponentModule {}
