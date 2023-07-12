import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ErrorAlertComponent,
  PhoneInputComponent,
} from '@newbee/newbee/shared/ui';
import {
  CountryService,
  getErrorMessage,
  HttpClientError,
  inputDisplayError,
  PhoneInput,
  phoneInputToString,
} from '@newbee/newbee/shared/util';
import type { EditUserForm } from '@newbee/newbee/user/util';
import type { Authenticator, User } from '@newbee/shared/util';
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
    ErrorAlertComponent,
  ],
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent implements OnInit, OnChanges {
  /**
   * The user to edit.
   */
  @Input() user!: User;

  /**
   * The authenticators of the user.
   */
  @Input() authenticators: Authenticator[] = [];

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
  @Input() editNamePending: boolean[] = [];

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
  @Output() edit = new EventEmitter<Partial<EditUserForm>>();

  /**
   * Indicates that the user has initiated a request to add a new authenticator.
   */
  @Output() addAuthenticator = new EventEmitter<void>();

  /**
   * The ID and new name value for the authenticator to update, for use in the smart UI parent.
   */
  @Output() updateName = new EventEmitter<{
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
   * The indexes of the authenticators that are currently being edited.
   */
  editingAuthenticators = new Set<number>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly countryService: CountryService
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
    const phoneNumber: PhoneInput | null = parsedPhoneNumber
      ? {
          country: this.countryService.getCountry(
            parsedPhoneNumber.country as string
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
   * Look out for changes to authenticators and update the form array, if relevant.
   *
   * @param changes The changes to the input of the component.
   */
  ngOnChanges(changes: SimpleChanges): void {
    const authenticators = changes['authenticators'];
    if (!authenticators) {
      return;
    }

    const authenticatorNames = this.editAuthenticatorForm.controls.names;
    authenticatorNames.clear();
    (authenticators.currentValue as Authenticator[]).forEach(
      (authenticator) => {
        authenticatorNames.push(this.fb.control(authenticator.name));
      }
    );
  }

  /**
   * Emit the `edit` output.
   */
  emitEdit(): void {
    this.edit.emit(this.editUserForm.value);
  }

  /**
   * Emit the `updateName` output.
   *
   * @param index The index of the authenticator to update.
   */
  emitUpdateName(index: number): void {
    const id = this.authenticators[index]?.id;
    if (!id) {
      return;
    }

    const name =
      this.editAuthenticatorForm.controls.names.at(index).value || null;
    this.updateName.emit({ id, name });
    this.editingAuthenticators.delete(index);
  }

  /**
   * Mark the given authenticator as being in edit mode.
   * @param index The index of the authenticator to put in edit mode.
   */
  editAuthenticator(index: number): void {
    this.editingAuthenticators.add(index);
  }

  /**
   * Mark the given authenticator as being in display mode.
   * @param index The index of the authenticator to put in display mode.
   */
  cancelEditAuthenticator(index: number): void {
    this.editingAuthenticators.delete(index);
  }

  /**
   * Whether the authenticator at the given index has a name value in its form control that's different than its current name value.
   * @param authenticator The authenticator to check.
   * @returns `true` if the names are different, `false` otherwise.
   */
  nameIsUnique(index: number): boolean {
    const authenticator = this.authenticators[index];
    if (!authenticator) {
      return false;
    }

    const name = this.editAuthenticatorForm.controls.names.at(index).value;
    return name !== authenticator.name;
  }

  /**
   * Whether to display a form input as having an error.
   *
   * @param formName The name of the form group to look at.
   * @param inputName The name of the form group's input to look at.
   *
   * @returns `true` if the input should display an error, `false` otherwise.
   */
  readonly inputDisplayError = (
    formName: 'editUser' | 'deleteUser',
    inputName: string
  ): boolean => {
    const form = this.getFormGroup(formName);
    return (
      inputDisplayError(form, inputName) ||
      !!this.httpClientError?.messages[inputName]
    );
  };

  /**
   * The input error message for the given form.
   *
   * @param formName The name of the form group to look at.
   * @param inputName The name of the form group's input to look at.
   *
   * @returns The input's error message if it has one, an empty string otherwise.
   */
  readonly inputErrorMessage = (
    formName: 'editUser' | 'deleteUser',
    inputName: string
  ): string => {
    const form = this.getFormGroup(formName);
    return (
      getErrorMessage(form.get(inputName)) ||
      (this.httpClientError?.messages[inputName] ?? '')
    );
  };

  /**
   * Get the form group associated with the given name.
   *
   * @param formName The name of the form group to get.
   *
   * @returns The form group associated with the given name.
   */
  private getFormGroup(formName: 'editUser' | 'deleteUser'): FormGroup {
    switch (formName) {
      case 'editUser':
        return this.editUserForm;
      case 'deleteUser':
        return this.deleteUserForm;
    }
  }
}
