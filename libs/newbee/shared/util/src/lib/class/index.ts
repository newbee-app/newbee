/**
 * A class for holding useful information about countries.
 */
export class Country {
  /**
   * Creates a new instance of `Country`.
   *
   * @param name The country's name (e.g. 'United States').
   * @param regionCode The country's region code (e.g. 'US').
   * @param dialingCode The country's dialing code (e.g. '1').
   */
  constructor(
    public readonly name: string,
    public readonly regionCode: string,
    public readonly dialingCode: string
  ) {}
}

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
