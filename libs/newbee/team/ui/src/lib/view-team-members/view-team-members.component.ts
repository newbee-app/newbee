import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
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
  AlertType,
  HttpClientError,
  SearchResultFormat,
  SelectOption,
  ShortUrl,
  getHttpClientErrorMsg,
  inputDisplayError,
  inputErrorMessage,
} from '@newbee/newbee/shared/util';
import {
  BaseCreateTeamMemberDto,
  Keyword,
  OrgMemberUser,
  TeamMember,
  TeamMemberUserOrgMember,
  TeamRoleEnum,
  User,
  apiRoles,
  checkRoles,
  generateLteTeamRoles,
  userDisplayName,
  userDisplayNameAndEmail,
  type OrgMember,
} from '@newbee/shared/util';
import { Subject, takeUntil } from 'rxjs';

/**
 * The dumb UI for viewing all of the team members belogining to a team.
 */
@Component({
  selector: 'newbee-view-team-members',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SearchableSelectComponent,
    AlertComponent,
    SearchbarComponent,
    TooltipComponent,
    SearchResultComponent,
  ],
  templateUrl: './view-team-members.component.html',
})
export class ViewTeamMembersComponent implements OnInit, OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();
  readonly alertType = AlertType;
  readonly keyword = Keyword;
  readonly shortUrl = ShortUrl;
  readonly searchResultFormat = SearchResultFormat;
  readonly apiRoles = apiRoles;
  readonly checkRoles = checkRoles;
  readonly userDisplayName = userDisplayName;
  readonly userDisplayNameAndEmail = userDisplayNameAndEmail;

  /**
   * The org member looking at the screen.
   */
  @Input() orgMember!: OrgMember;

  /**
   * The team member looking at the screen, if applicable.
   */
  @Input() teamMember: TeamMember | null = null;

  /**
   * All of the team members that currently belong to the team.
   */
  @Input() teamMembers: TeamMemberUserOrgMember[] = [];

  /**
   * All of the org members eligible to be added to the team (the ones that don't already belong to the team).
   */
  @Input()
  set orgMembers(orgMembers: OrgMemberUser[]) {
    this.orgMemberOptions = orgMembers.map((orgMember) => {
      return new SelectOption(
        orgMember,
        userDisplayNameAndEmail(orgMember.user),
        userDisplayName(orgMember.user),
      );
    });
  }

  /**
   * The successfully added user, if a user was successfully added.
   */
  @Input()
  get addedUser(): User | null {
    return this._addedUser;
  }
  set addedUser(addedUser: User | null) {
    this._addedUser = addedUser;
    if (!addedUser) {
      return;
    }

    this.addMemberForm.setValue({ member: null, role: null });
    this.addMemberForm.markAsPristine();
    this.addMemberForm.markAsUntouched();
  }
  private _addedUser: User | null = null;

  /**
   * Whether to display the spinner on the add member button.
   */
  @Input() addMemberPending = false;

  /**
   * Whether to display a loading symbol for deleting a team member.
   */
  @Input() deleteMemberPending = new Map<string, boolean>();

  /**
   * An HTTP error for the component, if one exists.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The information necessary for the smart UI parent to create a team member.
   */
  @Output() addTeamMember = new EventEmitter<BaseCreateTeamMemberDto>();

  /**
   * The org member slug of the team member to delete, for use in the smart UI parent.
   */
  @Output() deleteTeamMember = new EventEmitter<string>();

  /**
   * Where to navigate to, relative to the org.
   */
  @Output() orgNavigate = new EventEmitter<string>();

  /**
   * The form containing the org member and role for the user wants to add to the team.
   */
  addMemberForm = this.fb.group({
    member: [null as null | OrgMemberUser, [Validators.required]],
    role: [null as null | TeamRoleEnum, [Validators.required]],
  });

  /**
   * The form representing the searchbar.
   */
  searchbar = this.fb.control('');

  /**
   * The org members as select options.
   */
  orgMemberOptions: SelectOption<OrgMemberUser>[] = [];

  /**
   * All possible team roles as select options, based on the requester.
   */
  roleOptions: SelectOption<TeamRoleEnum>[] = [];

  /**
   * All of the team members filtered by the search term.
   */
  teamMembersToShow: TeamMemberUserOrgMember[] = [];

  constructor(private readonly fb: FormBuilder) {
    this.searchbar.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (searchTerm) => {
        if (!searchTerm) {
          this.teamMembersToShow = this.teamMembers;
          return;
        }

        const lcSearchTerm = searchTerm.toLowerCase();
        this.teamMembersToShow = this.teamMembers.filter((teamMember) => {
          return userDisplayNameAndEmail(teamMember.user)
            .toLowerCase()
            .includes(lcSearchTerm);
        });
      },
    });
  }

  /**
   * Set up `orgMemberOptions`.
   */
  ngOnInit(): void {
    this.roleOptions = generateLteTeamRoles(
      this.orgMember.role,
      this.teamMember?.role ?? null,
    ).map((role) => new SelectOption(role, role));

    this.teamMembersToShow = this.teamMembers;
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Tell the parent UI to add the given member to the team.
   */
  emitAddTeamMember(): void {
    const { member, role } = this.addMemberForm.value;
    if (!member || !role) {
      return;
    }

    this.addTeamMember.emit({
      orgMemberSlug: member.orgMember.slug ?? '',
      role: role,
    });
  }

  /**
   * Tell the parent UI to navigate to the given path relative to the current org.
   * @param paths The path to navigate to, joined by `/`.
   */
  emitOrgNavigate(...paths: string[]): void {
    this.orgNavigate.emit(`/${paths.join('/')}`);
  }

  /**
   * Get the http client error message associated with the key.
   *
   * @param keys The key to look for.
   *
   * @returns The http client error message, if one exists.
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
      inputDisplayError(this.addMemberForm.get(inputName)) ||
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
      inputErrorMessage(this.addMemberForm.get(inputName)) ||
      getHttpClientErrorMsg(this.httpClientError, inputName)
    );
  }
}
