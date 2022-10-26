import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MagicLinkLoginRegisterForm } from '@newbee/newbee/auth/util';
import {
  PhoneInputComponentModule,
  TooltipComponentModule,
} from '@newbee/newbee/shared/ui';
import {
  CountryService,
  getErrorMessage,
  PhoneInput,
} from '@newbee/newbee/shared/util';
import { MagicLinkLoginBaseFormModule } from '../../base-form';

@Component({
  selector: 'newbee-magic-link-login-register-form',
  templateUrl: './magic-link-login-register-form.component.html',
})
export class MagicLinkLoginRegisterFormComponent {
  @Output() register = new EventEmitter<Partial<MagicLinkLoginRegisterForm>>();
  @Output() navigateToLogin = new EventEmitter<void>();

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required]],
    displayName: [''],
    phoneNumber: [
      { country: this.countryService.currentCountry, number: '' } as PhoneInput,
    ],
  });

  tooltipIds = {
    email: {
      container: 'email-container',
      tooltip: 'email-tooltip',
      message: 'email-message',
      tail: 'email-tail',
    },
    name: {
      container: 'name-container',
      tooltip: 'name-tooltip',
      message: 'name-message',
      tail: 'name-tail',
    },
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly countryService: CountryService
  ) {}

  inputIsClean(inputName: string): boolean {
    const input = this.registerForm.get(inputName);
    return !!input?.pristine && !!input.untouched;
  }

  inputIsValid(inputName: string): boolean {
    return !!this.registerForm.get(inputName)?.valid;
  }

  inputErrorMessage(inputName: string): string {
    return getErrorMessage(this.registerForm.get(inputName));
  }

  emitRegister(formValue: Partial<MagicLinkLoginRegisterForm>): void {
    this.register.emit(formValue);
  }

  emitNavigateToLogin(): void {
    this.navigateToLogin.emit();
  }
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MagicLinkLoginBaseFormModule,
    TooltipComponentModule,
    PhoneInputComponentModule,
  ],
  declarations: [MagicLinkLoginRegisterFormComponent],
  exports: [MagicLinkLoginRegisterFormComponent],
})
export class MagicLinkLoginRegisterFormModule {}
