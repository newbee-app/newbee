import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';

/**
 * A button that can display a spinner next to its text when told to do so.
 */
@Component({
  selector: 'newbee-button-with-spinner',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './button-with-spinner.component.html',
})
export class ButtonWithSpinnerComponent {
  /**
   * The ID to assign to the button.
   */
  @Input() buttonId!: string;

  /**
   * The text to put in the button.
   */
  @Input() buttonText!: string;

  /**
   * Whether the button should be disabled.
   */
  @Input() disabled = false;

  /**
   * Whether to display the spinner.
   */
  @Input() displaySpinner = false;

  /**
   * Indicates that the button has been clicked.
   */
  @Output() buttonClick = new EventEmitter<void>();

  /**
   * Emits `buttonClick`.
   */
  emitButtonClick(): void {
    this.buttonClick.emit();
  }
}
