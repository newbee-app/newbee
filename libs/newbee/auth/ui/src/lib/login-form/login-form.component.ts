import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginForm } from '@newbee/newbee/auth/util';
import { TooltipComponentModule } from '@newbee/newbee/shared/ui';
import { getErrorMessage } from '@newbee/newbee/shared/util';
import { BaseFormComponentModule } from '../base-form';

/**
 * The dumb UI for logging in an existing user.
 */
@Component({
  selector: 'newbee-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
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

  /**
   * The IDs for the login form's tooltips.
   */
  tooltipIds = {
    email: {
      container: 'email-container',
      tooltip: 'email-tooltip',
      message: 'email-tooltip-message',
      tail: 'email-tooltip-tail',
    },
  };

  constructor(private readonly fb: FormBuilder) {}

  /**
   * The form control for email.
   */
  get email(): AbstractControl<string | null, string | null> | null {
    return this.loginForm.get('email');
  }

  /**
   * Whether to show the email control's error message.
   */
  get showEmailError(): boolean {
    return (
      (!!this.email?.dirty || !!this.email?.touched) && !!this.email?.invalid
    );
  }

  /**
   * The email control's error message, if it has one. Will be an empty string if it doesn't.
   */
  get emailErrorMessage(): string {
    return getErrorMessage(this.email);
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

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TooltipComponentModule,
    BaseFormComponentModule,
  ],
  declarations: [LoginFormComponent],
  exports: [LoginFormComponent],
})
export class LoginFormComponentModule {}
