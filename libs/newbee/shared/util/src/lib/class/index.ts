export class Country {
  constructor(
    public readonly name: string,
    public readonly regionCode: string,
    public readonly dialingCode: number
  ) {}
}

export class SelectOption<T> {
  value: T;
  dropdownValue: string;
  selectedValue: string;

  constructor(value: T, dropdownValue: string, selectedValue?: string) {
    this.value = value;
    this.dropdownValue = dropdownValue;
    this.selectedValue = selectedValue ?? dropdownValue;
  }
}
