/* eslint-disable @typescript-eslint/ban-ts-comment */

import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgModule,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { ClickService, SelectOption } from '@newbee/newbee/shared/util';
import { isEqual } from 'lodash-es';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'newbee-searchable-select',
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
  implements OnDestroy, ControlValueAccessor
{
  @Input() options!: SelectOption<T>[];
  @Input() optionName!: string;
  @Input() valid = true;
  @Output() exited = new EventEmitter<void>();

  searchbox = new FormControl('');
  private _expanded = false;
  private selectedOption: SelectOption<T> | null = null;

  private readonly unsubscribe$ = new Subject<void>();
  private _disabled = false;
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _onChange: (_: T) => void = (_) => {
    return;
  };
  // @ts-ignore
  private _onTouched: () => void = () => {
    return;
  };

  @HostListener('keydown.escape') escapeEvent(): void {
    this.shrink();
  }

  constructor(
    readonly clickService: ClickService,
    readonly elementRef: ElementRef<HTMLElement>
  ) {
    clickService.documentClickTarget
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (target) => {
          if (
            !elementRef.nativeElement.contains(target) &&
            !target.id.includes('option-')
          ) {
            this.shrink();
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  writeValue(val: T): void {
    this.selectOption(val, false);
  }

  registerOnChange(fn: (_: T) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  toggleExpand(): void {
    if (this._expanded) {
      this.shrink();
    } else {
      this.expand();
    }
  }

  expand(): void {
    if (this._expanded) {
      return;
    }

    this._expanded = true;
  }

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

  get expanded(): boolean {
    return this._expanded;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  get value(): T | null {
    return this.selectedOption?.value ?? null;
  }

  get onChange(): (_: T) => void {
    return this._onChange;
  }

  get onTouched(): () => void {
    return this._onTouched;
  }

  get selectedText(): string {
    return this.selectedOption?.selectedValue ?? `Select ${this.optionName}`;
  }

  get optionsWithSearch(): SelectOption<T>[] {
    return this.options.filter((option) => {
      return option.dropdownValue
        .toLowerCase()
        .includes(this.searchbox.value?.toLowerCase() ?? '');
    });
  }

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
}

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [SearchableSelectComponent],
  exports: [SearchableSelectComponent],
})
export class SearchableSelectComponentModule {}
