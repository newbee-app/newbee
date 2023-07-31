import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertComponent } from '@newbee/newbee/shared/ui';
import {
  AlertType,
  getHttpClientErrorMsg,
  HttpClientError,
} from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { BaseFormComponent } from '../base-form';

/**
 * The dumb UI for displaying a user their JWT ID after a magic link login request.
 */
@Component({
  selector: 'newbee-jwt-id',
  standalone: true,
  imports: [CommonModule, BaseFormComponent, AlertComponent],
  templateUrl: './jwt-id.component.html',
})
export class JwtIdComponent {
  /**
   * Supported alert types.
   */
  readonly alertType = AlertType;

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
   * The misc errors, will be an empty string if there aren't any.
   */
  get miscError(): string {
    return getHttpClientErrorMsg(this.httpClientError, Keyword.Misc);
  }
}
