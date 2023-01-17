// Big chunks of this code was taken from: https://www.npmjs.com/package/@uiowa/digit-only

import { CommonModule } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  NgModule,
} from '@angular/core';

/**
 * A directive to be used with a form input that prevents non-number inputs.
 * Accounts for pasting and dragging.
 * Optionally allows for negative numbers and decimals.
 */
@Directive({
  selector: '[newbeeDigitOnly]',
})
export class DigitOnlyDirective {
  /**
   * All of the keys related to navigating the input.
   * We need to allow these, even though they're not numbers.
   */
  private readonly navigationKeys = new Set([
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
  ]);

  /**
   * Whether to allow decimal numbers. Defaults to `false`.
   */
  @Input() allowDecimal = false;

  /**
   * What character to use to represent a decimal. Defaults to `.`.
   */
  @Input() decimalSeparator = '.';

  /**
   * Whether to allow negative numbers. Defaults to `false`.
   */
  @Input() allowNegatives = false;

  /**
   * What character to use to represent a negative sign. Defaults to `-`.
   */
  @Input() negativeSign = '-';

  /**
   * Whether to allow pasting into the input. Defaults to `true`.
   */
  @Input() allowPaste = true;

  /**
   * The minimum number allowed in the input. Defaults to `-Infinity`.
   */
  @Input() min = -Infinity;

  /**
   * The maximum number allowed in the input. Defaults to `Infinity`.
   */
  @Input() max = Infinity;

  /**
   * The input element itself.
   */
  protected readonly inputElement: HTMLInputElement;

  constructor(elementRef: ElementRef<HTMLInputElement>) {
    this.inputElement = elementRef.nativeElement;
  }

  /**
   * Call `event.preventDefault()` and `event.stopPropagation()` unless the input is a number.
   *
   * @param event The `InputEvent` itself.
   */
  @HostListener('beforeinput', ['$event'])
  onBeforeInput(event: InputEvent): void {
    const input = event.data;
    if (!isNaN(Number(input))) {
      return;
    }

    if (
      (this.allowDecimal && input === this.decimalSeparator) ||
      (this.allowNegatives && input === this.negativeSign)
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Call `event.preventDefault()` and `event.stopPropagation()` unless the input is a navigation key or is used for copying and pasting.
   *
   * @param event The `KeyboardEvent` itself.
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const { key, code } = event;

    // allow for selecting, copying, cutting, and pasting
    if (
      this.navigationKeys.has(key) ||
      (event.ctrlKey && (key === 'a' || code === 'KeyA')) || // Allow: Ctrl+A
      (event.ctrlKey && (key === 'c' || code === 'KeyC')) || // Allow: Ctrl+C
      (event.ctrlKey && (key === 'v' || code === 'KeyV')) || // Allow: Ctrl+V
      (event.ctrlKey && (key === 'x' || code === 'KeyX')) || // Allow: Ctrl+X
      (event.metaKey && (key === 'a' || code === 'KeyA')) || // Allow: Cmd+A (Mac)
      (event.metaKey && (key === 'c' || code === 'KeyC')) || // Allow: Cmd+C (Mac)
      (event.metaKey && (key === 'v' || code === 'KeyV')) || // Allow: Cmd+V (Mac)
      (event.metaKey && (key === 'x' || code === 'KeyX')) // Allow: Cmd+X (Mac)
    ) {
      return;
    }

    if (this.newValueIsValid(this.previewInsert(key))) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Prevent pasting unless the result of the paste is a valid number.
   *
   * @param event The `ClipboardEvent` itself.
   */
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    if (!this.allowPaste) {
      event.stopPropagation();
      return;
    }

    const pastedInput = event.clipboardData?.getData('text/plain');
    if (!pastedInput) {
      event.stopPropagation();
      return;
    }

    const pasted = this.pasteData(pastedInput);
    if (!pasted) {
      event.stopPropagation();
      return;
    }
  }

  /**
   * Prevent dropping unless the result of the drop is a valid number.
   *
   * @param event The `DragEvent` itself.
   */
  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();

    const draggedInput = event.dataTransfer?.getData('text/plain') ?? '';
    this.inputElement.focus();
    const pasted = this.pasteData(draggedInput);
    if (!pasted) {
      event.stopPropagation();
      return;
    }
  }

  /**
   * Create a new form value and dispatch an `InputEvent` by inserting the given `pastedInput` where the cursor is.
   *
   * @param pastedInput The snippet to paste.
   * @returns `true` if the data was successfully pasted, `false` if not.
   */
  private pasteData(pastedInput: string): boolean {
    const newValue = this.previewInsert(pastedInput);
    if (!this.newValueIsValid(newValue)) {
      return false;
    }

    this.inputElement.value = newValue;
    this.inputElement.dispatchEvent(
      new InputEvent('input', { cancelable: true })
    );
    return true;
  }

  /**
   * Preview what the input will display after inserting the given value at the current cursor.
   *
   * @param value The value to insert into the current input.
   * @returns The new value, after inserting the given value at the cursor.
   */
  private previewInsert(value: string): string {
    const selectionStart = this.inputElement.selectionStart ?? 0;
    const selectionEnd = this.inputElement.selectionEnd ?? 0;
    const oldValue = this.inputElement.value;
    return (
      oldValue.substring(0, selectionStart) +
      value +
      oldValue.substring(selectionEnd)
    );
  }

  /**
   * Whether a given input value is a valid digit, according to the directive's constraints.
   *
   * @param newValue The value to check the validity of.
   * @returns `true` if the value is a valid digit, `false` if not.
   */
  private newValueIsValid(newValue: string): boolean {
    const numDecimals = newValue.split(this.decimalSeparator).length - 1;
    if (
      (!this.allowDecimal && numDecimals) ||
      (this.allowDecimal && numDecimals > 1)
    ) {
      return false;
    }

    const numNegativeSigns = newValue.split(this.negativeSign).length - 1;
    if (
      (!this.allowNegatives && numNegativeSigns) ||
      (this.allowNegatives &&
        (numNegativeSigns > 1 ||
          (numNegativeSigns === 1 && newValue.charAt(0) !== this.negativeSign)))
    ) {
      return false;
    }

    const newNumber = Number(newValue);
    if (isNaN(newNumber)) {
      return false;
    }

    if (newNumber > this.max || newNumber < this.min) {
      return false;
    }

    return true;
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [DigitOnlyDirective],
  exports: [DigitOnlyDirective],
})
export class DigitOnlyDirectiveModule {}
