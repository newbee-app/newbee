import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent, PhoneInputComponent } from '@newbee/newbee/shared/ui';
import {
  AlertType,
  CountryService,
  HttpClientError,
  PhoneInput,
  getHttpClientErrorMsg,
  inputDisplayError,
  inputErrorMessage,
  phoneInputToString,
} from '@newbee/newbee/shared/util';
import { BaseCreateUserDto, Keyword } from '@newbee/shared/util';
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
  readonly alertType = AlertType;
  readonly keyword = Keyword;

  /**
   * Whether to display the spinner on the register button.
   */
  @Input() registerPending!: boolean;

  /**
   * The emitted register form, for use in the smart UI parent.
   */
  @Output() register = new EventEmitter<BaseCreateUserDto>();

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
    private readonly countryService: CountryService,
  ) {}

  /**
   * The HTTP client error associate dwith the key, will be an empty string if there aren't any.
   */
  httpClientErrorMsg(...keys: string[]): string {
    return getHttpClientErrorMsg(this.httpClientError, keys.join('-'));
  }

  /**
   * Whether to display the input as having an error.
   *
   * @param inputName The input name to check.
   *
   * @returns `true` if the input should display an error, `false` otherwise.
   */
  inputDisplayError(inputName: string): boolean {
    return (
      inputDisplayError(this.registerForm.get(inputName)) ||
      !!getHttpClientErrorMsg(this.httpClientError, inputName)
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
      inputErrorMessage(this.registerForm.get(inputName)) ||
      getHttpClientErrorMsg(this.httpClientError, inputName)
    );
  }

  /**
   * Emit the `register` output.
   */
  emitRegister(): void {
    const { email, name, displayName, phoneNumber } = this.registerForm.value;
    const phoneNumberString = phoneNumber
      ? phoneInputToString(phoneNumber)
      : null;
    this.register.emit({
      email: email ?? '',
      name: name ?? '',
      displayName: displayName || null,
      phoneNumber: phoneNumberString,
    });
  }

  /**
   * Emit the `navigateToLogin` output.
   */
  emitNavigateToLogin(): void {
    this.navigateToLogin.emit();
  }
}
