import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { SelectOption } from '@newbee/newbee/shared/util';
import { isEqual } from 'lodash-es';
import { AlertComponent } from '../../alert/alert.component';
import { DropdownComponent } from '../../dropdown';
import { SearchbarComponent } from '../searchbar/searchbar.component';

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
    SearchbarComponent,
    AlertComponent,
    DropdownComponent,
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
export class SearchableSelectComponent<T> implements ControlValueAccessor {
  /**
   * Whether to show the searchbar component.
   */
  @Input() showSearchbar = true;

  /**
   * All of the possible options for the select.
   */
  @Input() options!: SelectOption<T>[];

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
   * Called to trigger change detection.
   *
   * @param _ The new value.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onChange: (_: T) => void = (_) => {
    return;
  };

  /**
   * Called to trigger change detection.
   */
  get onChange(): (_: T) => void {
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
  writeValue(val: T): void {
    this.selectOption(val, false);
  }

  /**
   * Registers the `_onChange` function.
   *
   * @param fn The function to assign.
   */
  registerOnChange(fn: (_: T) => void): void {
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
   * Get the list of options after filtering for the searchbox.
   */
  get optionsWithSearch(): SelectOption<T>[] {
    return this.options.filter((option) =>
      this.searchTerm.value
        ? option.dropdownValue
            .toLowerCase()
            .includes(this.searchTerm.value?.toLowerCase())
        : true
    );
  }

  /**
   * Set the `selectedOption` to the given option.
   * Calls change detection if we emit the event.
   *
   * @param option The option to select.
   * @param emitEvent Whether to trigger change detection.
   */
  selectOption(option: T, emitEvent = true): void {
    const foundOption = this.options.find((val) => isEqual(val.value, option));
    if (!foundOption) {
      return;
    }

    this.selectedOption = foundOption;
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
  expandedChange(newExpanded: boolean): void {
    if (newExpanded) {
      this.expand();
    } else {
      this.shrink();
    }
  }
}
