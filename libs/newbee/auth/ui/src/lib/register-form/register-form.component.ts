import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterForm } from '@newbee/newbee/auth/util';
import {
  ErrorAlertComponent,
  PhoneInputComponent,
} from '@newbee/newbee/shared/ui';
import {
  CountryService,
  getErrorMessage,
  HttpClientError,
  PhoneInput,
} from '@newbee/newbee/shared/util';
import { BaseFormComponent } from '../base-form';

/**
 * The dumb UI for registering a new user.
 */
@Component({
  selector: 'newbee-register-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseFormComponent,
    PhoneInputComponent,
    ErrorAlertComponent,
  ],
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
  /**
   * Whether to display the spinner on the register button.
   */
  @Input() registerPending!: boolean;

  /**
   * The emitted register form, for use in the smart UI parent.
   */
  @Output() register = new EventEmitter<Partial<RegisterForm>>();

  /**
   * An HTTP error for the component, if one exists.
   */
  @Input() httpClientError: HttpClientError | null = null;

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
   * Whether the given input is valid.
   *
   * @param inputName The name of the form group's input to look at.
   * @returns `true` if the input is valid, `false` otherwise.
   */
  inputIsValid(inputName: string): boolean {
    return !!this.registerForm.get(inputName)?.valid;
  }

  /**
   * Whether to display the input as having an error.
   * @param inputName The name of the form group's input to look at.
   * @returns `true` if the input should display an error, `false` otherwise.
   */
  inputDisplayError(inputName: string): boolean {
    return (
      (!this.inputIsClean(inputName) && !this.inputIsValid(inputName)) ||
      !!this.httpClientError?.messages?.[inputName]
    );
  }

  /**
   * The given input's error message.
   *
   * @param inputName The name of the form group's input to look at.
   * @returns The input's error message if it has one, an empty string otherwise.
   */
  inputErrorMessage(inputName: string): string {
    return (
      getErrorMessage(this.registerForm.get(inputName)) ||
      (this.httpClientError?.messages?.[inputName] ?? '')
    );
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
