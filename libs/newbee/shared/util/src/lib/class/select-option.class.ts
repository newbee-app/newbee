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
  dropdownValue: string;

  /**
   * The value to be displayed when the option is selected.
   */
  selectedValue: string;

  constructor(value: T, dropdownValue: string, selectedValue?: string) {
    this.value = value;
    this.dropdownValue = dropdownValue;
    this.selectedValue = selectedValue ?? dropdownValue;
  }
}
