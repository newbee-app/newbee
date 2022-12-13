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

/**
 * The dumb UI for registering a new user.
 */
@Component({
  selector: 'newbee-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
  /**
   * The emitted register form, for use in the smart UI parent.
   */
  @Output() register = new EventEmitter<Partial<RegisterForm>>();

  /**
   * The emitted request to navigate to the login page, for use in the smart UI parent.
   */
  @Output() navigateToLogin = new EventEmitter<void>();

  /**
   * The internal register form.
   */
  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required]],
    displayName: [''],
    phoneNumber: [
      { country: this.countryService.currentCountry, number: '' } as PhoneInput,
    ],
  });

  /**
   * The IDs for the register form's tooltips.
   */
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

  /**
   * Whether the given input is clean (pristine and untouched).
   *
   * @param inputName The name of the form group's input to look at.
   * @returns `true` if the input is clean, `false` otherwise.
   */
  inputIsClean(inputName: string): boolean {
    const input = this.registerForm.get(inputName);
    return !!input?.pristine && !!input.untouched;
  }

  /**
   * Whether the given input is valid (devoid of errors).
   *
   * @param inputName The name of the form group's input to look at.
   * @returns `true` if the input is valid, `false` otherwise.
   */
  inputIsValid(inputName: string): boolean {
    return !!this.registerForm.get(inputName)?.valid;
  }

  /**
   * The given input's error message.
   *
   * @param inputName The name of the form group's input to look at.
   * @returns The input's error message if it has one, an empty string otherwise.
   */
  inputErrorMessage(inputName: string): string {
    return getErrorMessage(this.registerForm.get(inputName));
  }

  /**
   * Emit the `register` output.
   */
  emitRegister(): void {
    this.register.emit(this.registerForm.value);
  }

  /**
   * Emit the `navigateToLogin` output.
   */
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
