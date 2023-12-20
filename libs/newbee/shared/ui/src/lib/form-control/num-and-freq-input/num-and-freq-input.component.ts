import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DigitOnlyDirectiveModule,
  Frequency,
  NumAndFreqInput,
  frequencySelectOptions,
  inputDisplayError,
  inputErrorMessage,
} from '@newbee/newbee/shared/util';
import { Subject, takeUntil } from 'rxjs';
import { AlertComponent } from '../../alert';
import { SearchableSelectComponent } from '../searchable-select';

/**
 * A custom num and frequency input component.
 * Fully compatible with Angular's form controls.
 * Provides additional features like:
 *
 * - Preventing users from inputting or pasting non-number values.
 */
@Component({
  selector: 'newbee-num-and-freq-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SearchableSelectComponent,
    AlertComponent,
    DigitOnlyDirectiveModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NumAndFreqInputComponent,
    },
  ],
  templateUrl: './num-and-freq-input.component.html',
})
export class NumAndFreqInputComponent
  implements ControlValueAccessor, OnDestroy
{
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * The internal form for keeping track of the num and freq.
   */
  numAndFreq = this.fb.group({
    num: [null as null | number, [Validators.min(1)]],
    frequency: [null as null | Frequency],
  });

  readonly frequencyOptions = frequencySelectOptions(
    this.numAndFreq.controls.num,
  );

  /**
   * Called to trigger change detection.
   * @param _ The new value.
   */
  private _onChange: (_: Partial<NumAndFreqInput>) => void = () => {
    return;
  };

  /**
   * Called to trigger change detection.
   */
  get onChange(): (_: Partial<NumAndFreqInput>) => void {
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

  constructor(private readonly fb: FormBuilder) {
    this.numAndFreq.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (val) => {
        this._onChange(val);
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
   * Sets the control's internal num and freq form group value.
   * Does not trigger change detection.
   *
   * @param val The new value for the internal num and freq form group.
   */
  writeValue(val: Partial<NumAndFreqInput>): void {
    this.numAndFreq.patchValue(val, { emitEvent: false });
  }

  /**
   * Register the `_onChange` function.
   *
   * @param fn The function to assign.
   */
  registerOnChange(fn: (_: Partial<NumAndFreqInput>) => void): void {
    this._onChange = fn;
  }

  /**
   * Register the `_onTouched` function.
   *
   * @param fn The function to assign.
   */
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /**
   * Disables or enables the control.
   * Does so by disabling/enabling the internal form group.
   *
   * @param isDisabled Whether to disable the form control
   */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.numAndFreq.disable();
    } else {
      this.numAndFreq.enable();
    }
  }

  /**
   * Whether the control should display an error for the given input.
   *
   * @param inputName The name of the input to look at.
   *
   * @returns `true` if an error should be displayed for the input, `false` otherwise.
   */
  displayError(inputName: 'num' | 'frequency'): boolean {
    return inputDisplayError(this.numAndFreq.get(inputName));
  }

  /**
   * The error message for the given input.
   *
   * @param inputName The name of the input to look at.
   *
   * @returns An empty string if there is no error, or an error message if there is an error for the input.
   */
  errorMessage(inputName: 'num' | 'frequency'): string {
    return inputErrorMessage(this.numAndFreq.get(inputName));
  }
}
