import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MagicLinkLoginLoginForm } from '@newbee/newbee/auth/util';
import { TooltipComponentModule } from '@newbee/newbee/shared/ui';
import { getErrorMessage } from '@newbee/newbee/shared/util';
import { MagicLinkLoginBaseFormComponentModule } from '../../base-form';

@Component({
  selector: 'newbee-magic-link-login-login-form',
  templateUrl: './magic-link-login-login-form.component.html',
})
export class MagicLinkLoginLoginFormComponent {
  @Output() login = new EventEmitter<Partial<MagicLinkLoginLoginForm>>();
  @Output() navigateToRegister = new EventEmitter<void>();

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  tooltipIds = {
    container: 'email-container',
    tooltip: 'email-tooltip',
    message: 'email-tooltip-message',
    tail: 'email-tooltip-tail',
  };

  constructor(private readonly fb: FormBuilder) {}

  get email() {
    return this.loginForm.get('email');
  }

  get emailInputIsClean(): boolean {
    return !!this.email?.pristine && !!this.email?.untouched;
  }

  get emailInputIsValid(): boolean {
    return !!this.email?.valid;
  }

  get emailErrorMessage(): string {
    return getErrorMessage(this.email);
  }

  emitLogin(formValue: Partial<MagicLinkLoginLoginForm>): void {
    this.login.emit(formValue);
  }

  emitNavigateToRegister(): void {
    this.navigateToRegister.emit();
  }
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MagicLinkLoginBaseFormComponentModule,
    TooltipComponentModule,
  ],
  declarations: [MagicLinkLoginLoginFormComponent],
  exports: [MagicLinkLoginLoginFormComponent],
})
export class MagicLinkLoginLoginFormComponentModule {}
