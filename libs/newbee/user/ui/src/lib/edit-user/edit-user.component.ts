import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import {
  Authenticator,
  BaseUpdateUserDto,
  Keyword,
  type User,
} from '@newbee/shared/util';
import parsePhoneNumber from 'libphonenumber-js';

/**
 * The dumb UI for editing a user.
 */
@Component({
  selector: 'newbee-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PhoneInputComponent,
    AlertComponent,
  ],
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent implements OnInit {
  readonly keyword = Keyword;
  readonly alertType = AlertType;

  /**
   * The user to edit.
   */
  @Input() user!: User;

  /**
   * The authenticators of the user.
   */
  @Input()
  get authenticators(): Authenticator[] {
    return this._authenticators;
  }
  set authenticators(authenticators: Authenticator[]) {
    this._authenticators = authenticators;
    const authenticatorNames = this.editAuthenticatorForm.controls.names;
    authenticatorNames.clear();
    authenticators.forEach((authenticator) => {
      authenticatorNames.push(this.fb.control(authenticator.name));
    });
  }
  _authenticators: Authenticator[] = [];

  /**
   * Whether to display the spinner on the edit button.
   */
  @Input() editPending = false;

  /**
   * Whether to display the spinner on the add authenticator button.
   */
  @Input() addAuthenticatorPending = false;

  /**
   * Whether to display the loader on an authenticator.
   */
  @Input() editAuthenticatorPending = new Set<string>();

  /**
   * Whether to display the loader on an authenticator.
   */
  @Input() deleteAuthenticatorPending = new Set<string>();

  /**
   * Whether to display the spinner on the delete button.
   */
  @Input() deletePending = false;

  /**
   * An HTTP error for the component, if one exists.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The emitted edit user form, for use in the smart UI parent.
   */
  @Output() edit = new EventEmitter<BaseUpdateUserDto>();

  /**
   * Indicates that the user has initiated a request to add a new authenticator.
   */
  @Output() addAuthenticator = new EventEmitter<void>();

  /**
   * The ID and new name value for the authenticator to update, for use in the smart UI parent.
   */
  @Output() editAuthenticator = new EventEmitter<{
    id: string;
    name: string | null;
  }>();

  /**
   * The ID of the authenticator to delete, for use in the smart UI parent.
   */
  @Output() deleteAuthenticator = new EventEmitter<string>();

  /**
   * The emitted delete request, for use in the smart UI parent.
   */
  @Output() delete = new EventEmitter<void>();

  /**
   * The internal edit user form.
   */
  editUserForm = this.fb.group({
    name: ['', Validators.required],
    displayName: [''],
    phoneNumber: [
      { country: this.countryService.currentCountry, number: '' } as PhoneInput,
    ],
  });

  /**
   * The internal delete user form.
   */
  deleteUserForm = this.fb.group({
    delete: ['', [Validators.required, Validators.pattern('DELETE')]],
  });

  /**
   * A form array containing form controls for each authenticator in authenticators.
   * Wrapped in a redundant form group because Angular requires it (idk why).
   */
  editAuthenticatorForm = this.fb.group({
    names: this.fb.array<string | null>([]),
  });

  /**
   * The IDs of the authenticators that are currently being edited.
   */
  editingAuthenticators = new Set<string>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly countryService: CountryService,
  ) {}

  /**
   * Whether the edit user form has a value distinct from the current user's values.
   */
  get editDistinct(): boolean {
    const { name, displayName, phoneNumber } = this.editUserForm.value;
    const phoneNumberString = phoneNumber
      ? phoneInputToString(phoneNumber)
      : null;
    return (
      name !== this.user.name ||
      (displayName || null) !== this.user.displayName ||
      (phoneNumberString || null) !== this.user.phoneNumber
    );
  }

  /**
   * Initialize the edit user form with the values of the current user.
   */
  ngOnInit(): void {
    const parsedPhoneNumber = this.user.phoneNumber
      ? parsePhoneNumber(this.user.phoneNumber)
      : undefined;
    const phoneNumber = parsedPhoneNumber
      ? {
          country: this.countryService.getCountry(
            parsedPhoneNumber.country as string,
          ),
          number: parsedPhoneNumber.nationalNumber,
        }
      : null;

    this.editUserForm.patchValue({
      name: this.user.name,
      displayName: this.user.displayName,
      ...(phoneNumber && { phoneNumber }),
    });
  }

  /**
   * Emit the `edit` output.
   */
  emitEdit(): void {
    const { name, displayName, phoneNumber } = this.editUserForm.value;
    const phoneNumberString = phoneNumber
      ? phoneInputToString(phoneNumber)
      : null;
    this.edit.emit({
      name: name ?? '',
      displayName: displayName || null,
      phoneNumber: phoneNumberString,
    });
  }

  /**
   * Emit the `updateName` output.
   *
   * @param index The index of the authenticator to update.
   * @param id The ID of the authenticator to update.
   */
  emitEditAuthenticator(index: number, id: string): void {
    const name =
      this.editAuthenticatorForm.controls.names.at(index).value || null;
    this.editAuthenticator.emit({ id, name });
    this.editingAuthenticators.delete(id);
  }

  /**
   * Mark the given authenticator as being in edit mode.
   *
   * @param id The ID of the authenticator to put in edit mode.
   */
  startEditAuthenticator(id: string): void {
    this.editingAuthenticators.add(id);
  }

  /**
   * Mark the given authenticator as being in display mode.
   *
   * @param id The ID of the authenticator to put in display mode.
   */
  cancelEditAuthenticator(id: string): void {
    this.editingAuthenticators.delete(id);
  }

  /**
   * Whether the authenticator at the given index has a name value in its form control that's different than its current name value.
   *
   * @param index The index of the authenticator to check.
   * @param authenticator The authenticator to check.
   *
   * @returns `true` if the names are different, `false` otherwise.
   */
  nameIsUnique(index: number, authenticator: Authenticator): boolean {
    const name = this.editAuthenticatorForm.controls.names.at(index).value;
    return name !== authenticator.name;
  }

  /**
   * Get the error message associated with the key.
   *
   * @param key The key to find the error message.
   *
   * @returns The error message associated with the key, an empty string if there isn't one.
   */
  httpClientErrorMsg(...key: string[]): string {
    return getHttpClientErrorMsg(this.httpClientError, key.join('-'));
  }

  /**
   * Whether to display a form input as having an error.
   *
   * @param inputGroup The form group to look at.
   * @param inputName The name of the form group's input to look at.
   *
   * @returns `true` if the input should display an error, `false` otherwise.
   */
  inputDisplayError(inputGroup: FormGroup, inputName: string): boolean {
    return (
      inputDisplayError(inputGroup.get(inputName)) ||
      !!getHttpClientErrorMsg(this.httpClientError, inputName)
    );
  }

  /**
   * The input error message for the given form.
   *
   * @param inputGroup The form group to look at.
   * @param inputName The name of the form group's input to look at.
   *
   * @returns The input's error message if it has one, an empty string otherwise.
   */
  inputErrorMessage(inputGroup: FormGroup, inputName: string): string {
    return (
      inputErrorMessage(inputGroup.get(inputName)) ||
      getHttpClientErrorMsg(this.httpClientError, inputName)
    );
  }
}
