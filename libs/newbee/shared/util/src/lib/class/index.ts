export class SelectOption {
  value: string;
  dropdownValue: string;
  selectedValue: string;

  constructor(value: string, dropdownValue?: string, selectedValue?: string) {
    this.value = value;
    this.dropdownValue = dropdownValue ?? value;
    this.selectedValue = selectedValue ?? dropdownValue ?? value;
  }
}
