import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterForm } from '@newbee/newbee/auth/util';
import { AlertComponent, PhoneInputComponent } from '@newbee/newbee/shared/ui';
import {
  CountryService,
  getErrorMessage,
  HttpClientError,
  inputDisplayError,
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
    AlertComponent,
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
   * Whether to display the input as having an error.
   *
   * @param inputName The input name to check.
   *
   * @returns `true` if the input should display an error, `false` otherwise.
   */
  inputDisplayError(inputName: string): boolean {
    return (
      inputDisplayError(this.registerForm, inputName) ||
      !!this.httpClientError?.messages?.[inputName]
    );
  }

  /**
   * The given input's error message.
   *
   * @param inputName The name of the form group's input to look at.
   *
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
