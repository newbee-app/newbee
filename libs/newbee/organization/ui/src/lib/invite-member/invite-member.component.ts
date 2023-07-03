import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { InviteMemberForm } from '@newbee/newbee/organization/util';
import {
  ErrorAlertComponent,
  SearchableSelectComponent,
  SuccessAlertComponent,
} from '@newbee/newbee/shared/ui';
import {
  getErrorMessage,
  HttpClientError,
  inputDisplayError,
  SelectOption,
} from '@newbee/newbee/shared/util';
import { OrgRoleEnum } from '@newbee/shared/util';

/**
 * The dumb UI for inviting a user to an org.
 */
@Component({
  selector: 'newbee-invite-member',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SearchableSelectComponent,
    ErrorAlertComponent,
    SuccessAlertComponent,
  ],
  templateUrl: './invite-member.component.html',
})
export class InviteMemberComponent implements OnChanges {
  /**
   * Whether to display the spinner on the invite button.
   */
  @Input() invitePending = false;

  /**
   * The successfully invited user's email address, if a user was successfully invited.
   */
  @Input() invitedUser = '';

  /**
   * An HTTP error for the component, if one exists.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The emitted invite member form, for use in the smart UI parent.
   */
  @Output() invite = new EventEmitter<Partial<InviteMemberForm>>();

  /**
   * All possible org roles as select options.
   */
  roleOptions = Object.entries(OrgRoleEnum).map(
    ([key, value]) => new SelectOption(value, key)
  );

  /**
   * The internal form to invite a user to an org.
   */
  inviteMemberForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: [OrgRoleEnum.Member, Validators.required],
  });

  constructor(private readonly fb: FormBuilder) {
    this.inviteMemberForm.valueChanges.subscribe({
      next: (value) => {
        console.log(value);
        console.log(this.inviteMemberForm.valid);
      },
    });
  }

  /**
   * The text to display in the success alert.
   */
  get inviteSuccessText(): string {
    return `An invite was successfully sent to ${this.invitedUser}`;
  }

  /**
   * When the value of `invitedUser` is updated, clear the input.
   *
   * @param changes All of the changes to the component's inputs.
   */
  ngOnChanges(changes: SimpleChanges): void {
    const invitedUser = changes['invitedUser'];
    if (!invitedUser) {
      return;
    }

    this.inviteMemberForm.patchValue({ email: '' });
    this.inviteMemberForm.markAsPristine();
    this.inviteMemberForm.markAsUntouched();
  }

  /**
   * Emit the `invite` output.
   */
  emitInvite(): void {
    this.invite.emit(this.inviteMemberForm.value);
  }

  /**
   * Whether to display an input as having an error.
   *
   * @param inputName The name of the input to look at.
   *
   * @returns `true` if the input should display an error, `false` otherwise.
   */
  readonly inputDisplayError = (inputName: string): boolean =>
    inputDisplayError(this.inviteMemberForm, inputName) ||
    !!this.httpClientError?.messages[inputName];

  /**
   * The input error message for the given form.
   *
   * @param inputName
   * @returns
   */
  readonly inputErrorMessage = (inputName: string): string =>
    getErrorMessage(this.inviteMemberForm.get(inputName)) ||
    (this.httpClientError?.messages[inputName] ?? '');
}
