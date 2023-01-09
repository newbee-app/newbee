import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { ErrorFooterComponentModule } from '@newbee/newbee/shared/ui';
import { HttpClientError } from '@newbee/newbee/shared/util';
import { BaseFormComponentModule } from '../base-form';

/**
 * The dumb UI for displaying a user their JWT ID after a magic link login request.
 */
@Component({
  selector: 'newbee-jwt-id',
  templateUrl: './jwt-id.component.html',
})
export class JwtIdComponent {
  /**
   * The JWT ID value to display.
   */
  @Input() jwtId!: string;

  /**
   * The email the magic link login was sent to for display.
   */
  @Input() email!: string;

  /**
   * An HTTP error for the component, if one exists.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The emitted request to resend the magic link login request.
   */
  @Output() resendLink = new EventEmitter<string>();

  /**
   * Emit the `resendLink` output.
   */
  emitResendLink(): void {
    this.resendLink.emit(this.email);
  }

  /**
   * Extracts the `httpClientError` into a human-readable string.
   */
  get httpError(): string {
    return this.httpClientError?.messages?.['misc'] ?? '';
  }
}

@NgModule({
  imports: [CommonModule, BaseFormComponentModule, ErrorFooterComponentModule],
  declarations: [JwtIdComponent],
  exports: [JwtIdComponent],
})
export class JwtIdComponentModule {}
