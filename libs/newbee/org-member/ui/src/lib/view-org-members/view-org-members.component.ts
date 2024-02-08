import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AlertComponent,
  SearchResultComponent,
  SearchableSelectComponent,
  SearchbarComponent,
  TooltipComponent,
} from '@newbee/newbee/shared/ui';
import {
  HttpClientError,
  RouteAndQueryParams,
  SearchResultFormat,
  SelectOption,
  ShortUrl,
  getHttpClientErrorMsg,
  inputDisplayError,
  inputErrorMessage,
} from '@newbee/newbee/shared/util';
import {
  CreateOrgMemberInviteDto,
  Keyword,
  OrgMemberUser,
  OrgRoleEnum,
  apiRoles,
  checkRoles,
  generateLteOrgRoles,
  userDisplayNameAndEmail,
  type OrgMember,
} from '@newbee/shared/util';
import { Subject, takeUntil } from 'rxjs';

/**
 * The dumb UI for viewing org members and inviting new users to the org.
 */
@Component({
  selector: 'newbee-view-org-members',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SearchableSelectComponent,
    SearchbarComponent,
    SearchResultComponent,
    AlertComponent,
    TooltipComponent,
  ],
  templateUrl: './view-org-members.component.html',
})
export class ViewOrgMembersComponent implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();
  readonly keyword = Keyword;
  readonly shortUrl = ShortUrl;
  readonly searchResultFormat = SearchResultFormat;
  readonly apiRoles = apiRoles;
  readonly checkRoles = checkRoles;
  readonly userDisplayNameAndEmail = userDisplayNameAndEmail;

  /**
   * The org member making the invite requests and looking at the page.
   */
  @Input()
  get orgMember(): OrgMember {
    return this._orgMember;
  }
  set orgMember(orgMember: OrgMember) {
    this._orgMember = orgMember;
    this._roleOptions = generateLteOrgRoles(this.orgMember.role).map(
      (role) => new SelectOption(role, role),
    );
  }
  private _orgMember!: OrgMember;

  /**
   * The org members making up the org.
   */
  @Input()
  get orgMembers(): OrgMemberUser[] {
    return this._orgMembers;
  }
  set orgMembers(orgMembers: OrgMemberUser[]) {
    this._orgMembers = orgMembers;
    this.updateOrgMembersToShow();
  }
  private _orgMembers: OrgMemberUser[] = [];

  /**
   * Whether to display the spinner on the invite button.
   */
  @Input()
  get invitePending(): boolean {
    return this._invitePending;
  }
  set invitePending(invitePending: boolean) {
    this._invitePending = invitePending;

    if (invitePending) {
      this.inviteOrgMemberForm.setValue({ email: '', role: null });
      this.inviteOrgMemberForm.markAsPristine();
      this.inviteOrgMemberForm.markAsUntouched();
    }
  }
  private _invitePending = false;

  /**
   * An HTTP error for the component, if one exists.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The emitted invite member form, for use in the smart UI parent.
   */
  @Output() invite = new EventEmitter<CreateOrgMemberInviteDto>();

  /**
   * The path to navigate to, relative to the current org.
   */
  @Output() orgNavigate = new EventEmitter<RouteAndQueryParams>();

  /**
   * The internal form to invite a user to an org.
   */
  inviteOrgMemberForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: [null as null | OrgRoleEnum, [Validators.required]],
  });

  /**
   * The form control representing the searchbar.
   */
  searchbar = this.fb.control('');

  /**
   * All possible org roles as select options, based on the requester.
   */
  get roleOptions(): SelectOption<OrgRoleEnum>[] {
    return this._roleOptions;
  }
  private _roleOptions: SelectOption<OrgRoleEnum>[] = [];

  /**
   * All of the org members filtered by the search term.
   */
  get orgMembersToShow(): OrgMemberUser[] {
    return this._orgMembersToShow;
  }
  private _orgMembersToShow: OrgMemberUser[] = [];

  /**
   * Set up the searchbar to update `orgMembersToShow` whenever its value changes.
   */
  constructor(private readonly fb: FormBuilder) {
    this.searchbar.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: () => {
        this.updateOrgMembersToShow();
      },
    });
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Emit the `invite` output.
   */
  emitInvite(): void {
    const { email, role } = this.inviteOrgMemberForm.value;
    if (!email || !role) {
      return;
    }

    this.invite.emit(new CreateOrgMemberInviteDto(email, role));
  }

  /**
   * Get the HTTP client error message associated with the key.
   *
   * @param keys The key to look for.
   *
   * @returns The HTTP client error message, if one exists.
   */
  httpClientErrorMsg(...keys: string[]): string {
    return getHttpClientErrorMsg(this.httpClientError, keys.join('-'));
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
      inputDisplayError(this.inviteOrgMemberForm.get(inputName)) ||
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
      inputErrorMessage(this.inviteOrgMemberForm.get(inputName)) ||
      getHttpClientErrorMsg(this.httpClientError, inputName)
    );
  }

  /**
   * Update `orgMembersToShow` to filter using the given search term.
   */
  private updateOrgMembersToShow(): void {
    const searchTerm = this.searchbar.value;
    if (!searchTerm) {
      this._orgMembersToShow = this._orgMembers;
      return;
    }

    this._orgMembersToShow = this._orgMembers.filter((orgMember) => {
      return userDisplayNameAndEmail(orgMember.user)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }
}
