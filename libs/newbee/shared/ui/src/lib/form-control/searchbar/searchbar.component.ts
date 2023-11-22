import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { ignoreMouseEvent } from '@newbee/newbee/shared/util';
import { stripHtmlTags } from '@newbee/shared/util';
import { Subject, takeUntil } from 'rxjs';
import { DropdownComponent } from '../../dropdown';

/**
 * A custom searchbar input component.
 * Emits what the user is searching as an output.
 */
@Component({
  selector: 'newbee-searchbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SearchbarComponent,
    },
  ],
  templateUrl: './searchbar.component.html',
})
export class SearchbarComponent implements OnDestroy, ControlValueAccessor {
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
   * Suggestions based on the user's search term.
   */
  @Input() suggestions: string[] = [];

  /**
   * Emits if the user clicks on a suggestion.
   */
  @Output() selectSuggestion = new EventEmitter<string>();

  /**
   * The input element associated with the searchbar.
   */
  @ViewChild('searchbarInput') searchbarInput!: ElementRef<HTMLInputElement>;

  /**
   * The internal form control for the searchbar input.
   */
  searchbar = new FormControl('');

  /**
   * Whether the searchbar is expanded to display suggestions.
   */
  suggestionsExpanded = false;

  /**
   * Call the method to ignore a fed-in mouse event.
   */
  readonly ignoreMouseEvent = ignoreMouseEvent;

  /**
   * Call to strip HTML tags from a string.
   */
  readonly stripHtmlTags = stripHtmlTags;

  /**
   * Used to unsubscribe from infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * Called to trigger change detection.
   *
   * @param _ The new value.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onChange: (_: string | null) => void = (_) => {
    return;
  };

  /**
   * Getter for the inner `_onChange` function.
   */
  get onChange(): (_: string | null) => void {
    return this._onChange;
  }

  /**
   * Called to mark the control as touched.
   */
  private _onTouched: () => void = () => {
    return;
  };

  /**
   * Getter for the inner `_onTouched` function.
   */
  get onTouched(): () => void {
    return this._onTouched;
  }

  /**
   * When `esc` is pressed, blur the input.
   */
  @HostListener('keyup.escape')
  escapeEvent(): void {
    this.searchbarInput.nativeElement.blur();
  }

  /**
   * When `enter` is pressed, blur the input and minimize the suggestions.
   */
  @HostListener('keyup.enter')
  enterEvent(): void {
    this.searchbarInput.nativeElement.blur();
    this.suggestionsExpanded = false;
  }

  /**
   * Initialize the searchbar with the value of `searchTerm`.
   */
  constructor() {
    this.searchbar.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (value) => {
        this._onChange(value);
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
   * Sets the control's inner searchbar value.
   * Does not trigger change detection.
   *
   * @param val The new value for the internal searchbar.
   */
  writeValue(val: string): void {
    this.searchbar.setValue(val, { emitEvent: false });
  }

  /**
   * Registers the `_onChange` function.
   *
   * @param fn The function to assign.
   */
  registerOnChange(fn: (_: string | null) => void): void {
    this._onChange = fn;
  }

  /**
   * Registers the `_onTouched` function.
   *
   * @param fn The function to assign.
   */
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /**
   * Disables or enables the control.
   * Does so by disabling/enabling the internal searchbar control.
   *
   * @param isDisabled Whether to disable the form control.
   */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.searchbar.disable();
    } else {
      this.searchbar.enable();
    }
  }

  /**
   * Calls focus on the searchbar input.
   */
  focusOnInput(): void {
    this.searchbarInput.nativeElement.focus();
  }

  /**
   * Clear the searchbar.
   */
  clear(): void {
    this.searchbar.setValue('');
  }
}
