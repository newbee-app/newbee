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

@Component({
  selector: 'newbee-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  @Output() magicLinkLogin = new EventEmitter<Partial<LoginForm>>();
  @Output() webauthn = new EventEmitter<Partial<LoginForm>>();
  @Output() navigateToRegister = new EventEmitter<void>();

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  tooltipIds = {
    email: {
      container: 'email-container',
      tooltip: 'email-tooltip',
      message: 'email-tooltip-message',
      tail: 'email-tooltip-tail',
    },
  };

  constructor(private readonly fb: FormBuilder) {}

  get email(): AbstractControl<string | null, string | null> | null {
    return this.loginForm.get('email');
  }

  get showEmailError(): boolean {
    return (
      (!!this.email?.dirty || !!this.email?.touched) && !!this.email?.invalid
    );
  }

  get emailErrorMessage(): string {
    return getErrorMessage(this.email);
  }

  emitMagicLinkLogin(loginForm: Partial<LoginForm>): void {
    this.magicLinkLogin.emit(loginForm);
  }

  emitWebAuthn(loginForm: Partial<LoginForm>): void {
    this.webauthn.emit(loginForm);
  }

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
