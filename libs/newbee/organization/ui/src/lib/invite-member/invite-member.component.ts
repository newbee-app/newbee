import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { InviteMemberForm } from '@newbee/newbee/organization/util';
import {
  ErrorAlertComponent,
  SearchableSelectComponent,
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
  ],
  templateUrl: './invite-member.component.html',
})
export class InviteMemberComponent {
  /**
   * Whether to display the spinner on the invite button.
   */
  @Input() invitePending = false;

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
