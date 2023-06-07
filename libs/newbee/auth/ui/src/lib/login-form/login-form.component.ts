import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginForm } from '@newbee/newbee/auth/util';
import { ErrorAlertComponent } from '@newbee/newbee/shared/ui';
import {
  getErrorMessage,
  HttpClientError,
  inputDisplayError,
} from '@newbee/newbee/shared/util';
import { BaseFormComponent } from '../base-form';

/**
 * The dumb UI for logging in an existing user.
 */
@Component({
  selector: 'newbee-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseFormComponent,
    ErrorAlertComponent,
  ],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  /**
   * Whether to display the spinner on the login button.
   */
  @Input() loginPending!: boolean;

  /**
   * Whether to display the spinner on the magic link login button.
   */
  @Input() magicLinkPending!: boolean;

  /**
   * An HTTP error for the component, if one exists.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The emitted login form, for use in magic link login.
   */
  @Output() magicLinkLogin = new EventEmitter<Partial<LoginForm>>();

  /**
   * The emitted login form, for use in WebAuthn login.
   */
  @Output() webauthn = new EventEmitter<Partial<LoginForm>>();

  /**
   * The emitted request to navigate to the register page, for use in the smart UI parent.
   */
  @Output() navigateToRegister = new EventEmitter<void>();

  /**
   * The internal login form.
   */
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(private readonly fb: FormBuilder) {}

  /**
   * Whether to show the email control's error message.
   *
   * @returns `true` if the login form's email is clean and valid, `false` otherwise.
   */
  get showEmailError(): boolean {
    return (
      inputDisplayError(this.loginForm, 'email') ||
      !!this.httpClientError?.messages?.['email']
    );
  }

  /**
   * The email control's error message, if it has one. Will be an empty string if it doesn't.
   */
  get emailErrorMessage(): string {
    return (
      getErrorMessage(this.loginForm.get('email')) ||
      (this.httpClientError?.messages?.['email'] ?? '')
    );
  }

  /**
   * Emit the `magicLinkLogin` output.
   */
  emitMagicLinkLogin(): void {
    this.magicLinkLogin.emit(this.loginForm.value);
  }

  /**
   * Emit the `webauthn` output.
   */
  emitWebAuthn(): void {
    this.webauthn.emit(this.loginForm.value);
  }

  /**
   * Emit the `navigateToRegister` output.
   */
  emitNavigateToRegister(): void {
    this.navigateToRegister.emit();
  }
}
