import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { AlertType, SelectOption } from '@newbee/newbee/shared/util';
import { isEqual } from 'lodash-es';
import { Subject, takeUntil } from 'rxjs';
import { AlertComponent } from '../../alert/alert.component';
import { DropdownWithArrowComponent } from '../../dropdown';

/**
 * A custom `<select>` component.
 * Fully compatible with Angular's form controls.
 * Provides additional features like:
 *
 * - The ability to have an option display a different value when it's selected vs in the dropdown.
 * - A searchbox to limit the dropdown.
 * - A better UI.
 */
@Component({
  selector: 'newbee-searchable-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    DropdownWithArrowComponent,
  ],
  templateUrl: './searchable-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SearchableSelectComponent,
    },
  ],
})
export class SearchableSelectComponent<T>
  implements ControlValueAccessor, OnDestroy
{
  private readonly unsubscribe$ = new Subject<void>();
  readonly alertType = AlertType;

  /**
   * Whether to show the searchbar component.
   */
  @Input() showSearchbar = true;

  /**
   * All of the possible options for the select.
   */
  @Input()
  get options(): SelectOption<T>[] {
    return this._options;
  }
  set options(options: SelectOption<T>[]) {
    this._options = options;
    this.updateOptionsToShow();
  }
  private _options!: SelectOption<T>[];

  /**
   * What the options represent, for use when no option is selected.
   */
  @Input() optionName!: string;

  /**
   * Whether the control is in a valid state, for use in displaying an error outline.
   */
  @Input() valid = true;

  /**
   * Error text to display, if any.
   */
  @Input() errorText = '';

  /**
   * An emitter that tells the parent component when the user has blurred the control.
   */
  @Output() exited = new EventEmitter<void>();

  /**
   * The form control for the searchbar component.
   */
  searchTerm = new FormControl('');

  /**
   * A subset of options that include the search term.
   */
  optionsWithSearch: SelectOption<T>[] = [];

  /**
   * Whether the component's dropdown is currently expanded.
   */
  private _expanded = false;

  /**
   * Whether the component's dropdown is currently expanded.
   */
  get expanded(): boolean {
    return this._expanded;
  }

  /**
   * The currently selected value, which starts as null by default.
   */
  private selectedOption: SelectOption<T> | null = null;

  /**
   * Whether the control is disabled.
   */
  private _disabled = false;

  /**
   * Whether the control is disabled.
   */
  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Set up options with search based on the search term.
   */
  constructor() {
    this.searchTerm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: () => {
        this.updateOptionsToShow();
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
   * Called to trigger change detection.
   *
   * @param _ The new value.
   */
  private _onChange: (_: T | null) => void = () => {
    return;
  };

  /**
   * Called to trigger change detection.
   */
  get onChange(): (_: T | null) => void {
    return this._onChange;
  }

  /**
   * Called to mark the control as touched.
   */
  private _onTouched: () => void = () => {
    return;
  };

  /**
   * Called to mark the control as touched.
   */
  get onTouched(): () => void {
    return this._onTouched;
  }

  /**
   * Sets the selected option to the given value.
   * Does not trigger change detection.
   *
   * @param val The value of the option we wish to select.
   */
  writeValue(val: T | null): void {
    this.selectOption(val, false);
  }

  /**
   * Registers the `_onChange` function.
   *
   * @param fn The function to assign.
   */
  registerOnChange(fn: (_: T | null) => void): void {
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
   * Sets the `_disabled` value of the control.
   *
   * @param isDisabled Whether to disable the form control.
   */
  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  /**
   * The internal value associated with the currently selected option
   */
  get value(): T | null {
    return this.selectedOption?.value ?? null;
  }

  /**
   * The text to display for the control.
   * If an option has been selected, displays the `selectedValue` of the option.
   * Otherwise, prompts the user the select an option.
   */
  get selectedText(): string {
    return this.selectedOption?.selectedValue ?? `Select ${this.optionName}`;
  }

  /**
   * Set the `selectedOption` to the given option.
   * Calls change detection if we emit the event.
   *
   * @param option The option to select.
   * @param emitEvent Whether to trigger change detection.
   */
  selectOption(option: T | null, emitEvent = true): void {
    const foundOption = this.options.find((val) => isEqual(val.value, option));
    if (option !== null && !foundOption) {
      return;
    }

    this.selectedOption = foundOption ?? null;
    if (emitEvent) {
      this._onChange(option);
    }
    this.shrink(emitEvent);
  }

  /**
   * Expand the dropdown, if it's closed.
   */
  expand(): void {
    if (this._expanded) {
      return;
    }

    this._expanded = true;
  }

  /**
   * Close the dropdown, if it's expanded.
   *
   * @param emitEvent Whether to mark the control as touched and emit `exited` after closing the dropdown.
   */
  shrink(emitEvent = true): void {
    if (!this._expanded) {
      return;
    }

    this._expanded = false;
    if (emitEvent) {
      this._onTouched();
      this.exited.emit();
    }
  }

  /**
   * Take changes to `expanded` from the dropdown component and relay it to this one.
   *
   * @param newExpanded The new value for `expanded`.
   */
  onExpandedChange(newExpanded: boolean): void {
    if (newExpanded) {
      this.expand();
    } else {
      this.shrink();
    }
  }

  /**
   * Update `optionsWithSearch` to filter using the given search term.
   */
  private updateOptionsToShow(): void {
    const searchTerm = this.searchTerm.value;
    if (!searchTerm) {
      this.optionsWithSearch = this._options;
      return;
    }

    this.optionsWithSearch = this._options.filter((option) =>
      option.dropdownValue.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }
}
