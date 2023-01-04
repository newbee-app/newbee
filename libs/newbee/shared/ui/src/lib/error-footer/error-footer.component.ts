import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';

/**
 * An error message footer to conditionally display errors.
 */
@Component({
  selector: 'newbee-error-footer',
  templateUrl: './error-footer.component.html',
})
export class ErrorFooterComponent {
  /**
   * A string detailing the error text.
   */
  @Input()
  error = '';

  /**
   * Whether the component should be displayed.
   */
  @Input()
  displayError = false;
}

@NgModule({
  imports: [CommonModule],
  declarations: [ErrorFooterComponent],
  exports: [ErrorFooterComponent],
})
export class ErrorFooterComponentModule {}
