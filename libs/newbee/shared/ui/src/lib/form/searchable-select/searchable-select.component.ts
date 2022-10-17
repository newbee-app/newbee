import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ClickService, SelectOption } from '@newbee/newbee/shared/util';

@Component({
  selector: 'newbee-searchable-select',
  templateUrl: './searchable-select.component.html',
})
export class SearchableSelectComponent implements OnInit, OnDestroy {
  @Input() options!: SelectOption[];
  @Input() defaultOption?: string | SelectOption;
  @Input() optionName!: string;
  @Output() selected = new EventEmitter<string>();

  expand = false;
  selectedOption: SelectOption | null = null;
  searchbox = new FormControl('');

  constructor(readonly clickService: ClickService, elementRef: ElementRef) {
    clickService.documentClickTarget.subscribe({
      next: (target) => {
        if (!elementRef.nativeElement.contains(target)) {
          this.expand = false;
        }
      },
    });
  }

  ngOnInit(): void {
    if (this.defaultOption) {
      this.selectOption(this.defaultOption);
    }
  }

  ngOnDestroy(): void {
    this.clickService.documentClickTarget.unsubscribe();
  }

  toggleExpand(): void {
    this.expand = !this.expand;
  }

  get selectedText(): string {
    return this.selectedOption?.selectedValue ?? `Select ${this.optionName}`;
  }

  get optionsWithSearch(): SelectOption[] {
    return this.options.filter((option) => {
      return option.dropdownValue
        .toLowerCase()
        .includes(this.searchbox.value?.toLowerCase() ?? '');
    });
  }

  selectOption(option: SelectOption | string): void {
    const foundOption = this.options.find(
      (val) => val === option || val.value === option
    );
    if (!foundOption) {
      return;
    }

    this.selectedOption = foundOption;
    this.selected.emit(foundOption.value);
    this.expand = false;
  }
}

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [SearchableSelectComponent],
  exports: [SearchableSelectComponent],
})
export class SearchableSelectModule {}
