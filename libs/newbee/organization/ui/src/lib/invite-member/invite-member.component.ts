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
import {
  AlertComponent,
  SearchableSelectComponent,
} from '@newbee/newbee/shared/ui';
import {
  AlertType,
  HttpClientError,
  SelectOption,
  getHttpClientErrorMsg,
  inputDisplayError,
  inputErrorMessage,
} from '@newbee/newbee/shared/util';
import {
  BaseCreateOrgMemberInviteDto,
  Keyword,
  OrgRoleEnum,
  generateLteOrgRoles,
  type OrgMember,
} from '@newbee/shared/util';

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
    AlertComponent,
  ],
  templateUrl: './invite-member.component.html',
})
export class InviteMemberComponent implements OnChanges {
  readonly alertType = AlertType;

  /**
   * The org member making the invite requests and looking at the page.
   */
  @Input() orgMember!: OrgMember;

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
  @Output() invite = new EventEmitter<BaseCreateOrgMemberInviteDto>();

  /**
   * The internal form to invite a user to an org.
   */
  inviteMemberForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: [OrgRoleEnum.Member, [Validators.required]],
  });

  constructor(private readonly fb: FormBuilder) {}

  /**
   * The text to display in the success alert.
   */
  get inviteSuccessText(): string {
    return `An invite was successfully sent to ${this.invitedUser}`;
  }

  /**
   * All possible org roles as select options, based on the requester.
   */
  get roleOptions(): SelectOption<OrgRoleEnum>[] {
    return generateLteOrgRoles(this.orgMember.role).map(
      (role) => new SelectOption(role, role),
    );
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

    this.inviteMemberForm.setValue({ email: '', role: OrgRoleEnum.Member });
    this.inviteMemberForm.markAsPristine();
    this.inviteMemberForm.markAsUntouched();
  }

  /**
   * Emit the `invite` output.
   */
  emitInvite(): void {
    const { email, role } = this.inviteMemberForm.value;
    this.invite.emit({ email: email as string, role: role as OrgRoleEnum });
  }

  /**
   * The misc errors, will be an empty string if there aren't any.
   */
  get miscError(): string {
    return getHttpClientErrorMsg(this.httpClientError, Keyword.Misc);
  }

  /**
   * Whether to display an input as having an error.
   *
   * @param inputName The name of the input to look at.
   *
   * @returns `true` if the input should display an error, `false` otherwise.
   */
  inputDisplayError(inputName: string): boolean {
    return (
      inputDisplayError(this.inviteMemberForm.get(inputName)) ||
      !!getHttpClientErrorMsg(this.httpClientError, inputName)
    );
  }

  /**
   * The input error message for the given form.
   *
   * @param inputName The name of the input to look at.
   *
   * @returns The input's error message.
   */
  inputErrorMessage(inputName: string): string {
    return (
      inputErrorMessage(this.inviteMemberForm.get(inputName)) ||
      getHttpClientErrorMsg(this.httpClientError, inputName)
    );
  }
}
