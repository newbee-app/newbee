/**
 * A utility class for use in implementing a custom `<option>` attribute, for use with a custom `<select>`.
 */
export class SelectOption<T> {
  /**
   * The actual internal value to be associated with the option.
   */
  value: T;

  /**
   * The value to be displayed in the dropdown of all options.
   */
  private readonly _dropdownValue: string | (() => string);

  /**
   * The getter for `_dropdownValue`.
   */
  get dropdownValue(): string {
    return typeof this._dropdownValue === 'function'
      ? this._dropdownValue()
      : this._dropdownValue;
  }

  /**
   * The value to be displayed when the option is selected.
   */
  private readonly _selectedValue: string | (() => string);

  /**
   * The getter for `_selectedValue`.
   */
  get selectedValue(): string {
    return typeof this._selectedValue === 'function'
      ? this._selectedValue()
      : this._selectedValue;
  }

  constructor(
    value: T,
    dropdownValue: string | (() => string),
    selectedValue?: string | (() => string),
  ) {
    this.value = value;
    this._dropdownValue = dropdownValue;
    this._selectedValue = selectedValue ?? dropdownValue;
  }
}
