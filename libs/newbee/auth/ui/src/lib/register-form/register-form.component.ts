import { CommonModule } from '@angular/common';
import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterForm } from '@newbee/newbee/auth/util';
import {
  PhoneInputComponentModule,
  TooltipComponentModule,
} from '@newbee/newbee/shared/ui';
import {
  CountryService,
  getErrorMessage,
  PhoneInput,
} from '@newbee/newbee/shared/util';
import { BaseFormComponentModule } from '../base-form';

@Component({
  selector: 'newbee-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
  @Output() register = new EventEmitter<Partial<RegisterForm>>();
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

  emitRegister(formValue: Partial<RegisterForm>): void {
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
    BaseFormComponentModule,
    TooltipComponentModule,
    PhoneInputComponentModule,
  ],
  declarations: [RegisterFormComponent],
  exports: [RegisterFormComponent],
})
export class RegisterFormComponentModule {}
