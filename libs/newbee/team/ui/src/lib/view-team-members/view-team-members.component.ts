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
  CreateTeamMemberDto,
  Keyword,
  OrgMemberUser,
  TeamMember,
  TeamMemberUserOrgMember,
  TeamRoleEnum,
  UpdateTeamMemberDto,
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
export class ViewTeamMembersComponent implements OnDestroy {
  private readonly unsubscribe$ = new Subject<void>();
  readonly keyword = Keyword;
  readonly shortUrl = ShortUrl;
  readonly searchResultFormat = SearchResultFormat;
  readonly apiRoles = apiRoles;
  readonly checkRoles = checkRoles;
  readonly userDisplayNameAndEmail = userDisplayNameAndEmail;

  /**
   * The org member looking at the screen.
   */
  @Input()
  get orgMember(): OrgMember {
    return this._orgMember;
  }
  set orgMember(orgMember: OrgMember) {
    this._orgMember = orgMember;
    this.generateRoleOptions();
  }
  private _orgMember!: OrgMember;

  /**
   * The team member looking at the screen, if applicable.
   */
  @Input()
  get teamMember(): TeamMember | null {
    return this._teamMember;
  }
  set teamMember(teamMember: TeamMember | null) {
    this._teamMember = teamMember;
    this.generateRoleOptions();
  }
  private _teamMember: TeamMember | null = null;

  /**
   * All of the team members that currently belong to the team.
   */
  @Input()
  get teamMembers(): TeamMemberUserOrgMember[] {
    return this._teamMembers;
  }
  set teamMembers(teamMembers: TeamMemberUserOrgMember[]) {
    this._teamMembers = teamMembers;

    const teamMemberRoles = this.editTeamMemberForm.controls.roles;
    teamMemberRoles.clear();
    teamMembers.forEach((teamMember) => {
      teamMemberRoles.push(this.fb.control(teamMember.teamMember.role));
    });
    this.updateTeamMembersToShow();
  }
  private _teamMembers: TeamMemberUserOrgMember[] = [];

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
   * Whether to display the spinner on the add member button.
   */
  @Input()
  get addTeamMemberPending(): boolean {
    return this._addTeamMemberPending;
  }
  set addTeamMemberPending(addTeamMemberPending: boolean) {
    this._addTeamMemberPending = addTeamMemberPending;
    if (addTeamMemberPending) {
      this.addTeamMemberForm.setValue({ member: null, role: null });
      this.addTeamMemberForm.markAsPristine();
      this.addTeamMemberForm.markAsUntouched();
    }
  }
  _addTeamMemberPending = false;

  /**
   * Whether to display the loader on a team member.
   */
  @Input() editTeamMemberPending = new Set<string>();

  /**
   * Whether to display a loading symbol for deleting a team member.
   */
  @Input() deleteTeamMemberPending = new Set<string>();

  /**
   * An HTTP error for the component, if one exists.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The information necessary for the smart UI parent to create a team member.
   */
  @Output() addTeamMember = new EventEmitter<CreateTeamMemberDto>();

  /**
   * The information necessary for the smart UI parent to edit a team member.
   */
  @Output() editTeamMember = new EventEmitter<{
    orgMemberSlug: string;
    updateTeamMemberDto: UpdateTeamMemberDto;
  }>();

  /**
   * The org member slug of the team member to delete, for use in the smart UI parent.
   */
  @Output() deleteTeamMember = new EventEmitter<string>();

  /**
   * Where to navigate to, relative to the org.
   */
  @Output() orgNavigate = new EventEmitter<RouteAndQueryParams>();

  /**
   * The form containing the org member and role for the user wants to add to the team.
   */
  addTeamMemberForm = this.fb.group({
    member: [null as null | OrgMemberUser, [Validators.required]],
    role: [null as null | TeamRoleEnum, [Validators.required]],
  });

  /**
   * A form array containing form controls for each team member.
   * Wrapped in a redundant form group because Angular requires it (idk why).
   */
  editTeamMemberForm = this.fb.group({
    roles: this.fb.array<TeamRoleEnum>([]),
  });

  /**
   * The form control representing the searchbar.
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

  /**
   * The org member slugs of the team members that are currently being edited.
   */
  editingTeamMembers = new Set<string>();

  /**
   * A map mapping an org member's slug to its index in the editMemberForm's form array, in case its differnt due to search filtering.
   */
  orgMemberSlugToIndex = new Map<string, number>();

  /**
   * Set up the searchbar to update `teamMembersToShow` whenever its value changes.
   */
  constructor(private readonly fb: FormBuilder) {
    this.searchbar.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: () => {
        this.updateTeamMembersToShow();
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
   * Tell the parent UI to add the given member to the team.
   */
  emitAddTeamMember(): void {
    const { member, role } = this.addTeamMemberForm.value;
    if (!member || !role) {
      return;
    }

    this.addTeamMember.emit(
      new CreateTeamMemberDto(role, member.orgMember.slug),
    );
    this.editingTeamMembers.delete(member.orgMember.slug);
  }

  /**
   * Edit the team member using its form value given its org member slug.
   * @param orgMemberSlug The team member to edit.
   */
  emitEditTeamMember(orgMemberSlug: string): void {
    const index = this.orgMemberSlugToIndex.get(orgMemberSlug);
    if (index === undefined) {
      return;
    }

    const role = this.editTeamMemberForm.controls.roles.at(index).value;
    if (!role) {
      return;
    }

    this.editTeamMember.emit({
      orgMemberSlug,
      updateTeamMemberDto: new UpdateTeamMemberDto(role),
    });
    this.editingTeamMembers.delete(orgMemberSlug);
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
      inputDisplayError(this.addTeamMemberForm.get(inputName)) ||
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
      inputErrorMessage(this.addTeamMemberForm.get(inputName)) ||
      getHttpClientErrorMsg(this.httpClientError, inputName)
    );
  }

  /**
   * Whether the form value for the given org member slug is unique from the given role.
   *
   * @param orgMemberSlug The org member slug to look for in the form.
   * @param role The role value to compare.
   *
   * @returns `true` if the form value role is truthy and distinct from the given role, `false` otherwise.
   */
  roleIsUnique(orgMemberSlug: string, role: TeamRoleEnum): boolean {
    const index = this.orgMemberSlugToIndex.get(orgMemberSlug);
    if (index === undefined) {
      return false;
    }

    const formRole = this.editTeamMemberForm.controls.roles.at(index).value;
    if (!formRole) {
      return false;
    }

    return formRole !== role;
  }

  /**
   * Update `teamMembersToShow` to filter using the given search term and map the new values to `orgMemberSlugToIndex`.
   */
  private updateTeamMembersToShow(): void {
    const searchTerm = this.searchbar.value;
    if (!searchTerm) {
      this.teamMembersToShow = this._teamMembers;
    } else {
      this.teamMembersToShow = this._teamMembers.filter((teamMember) => {
        return userDisplayNameAndEmail(teamMember.user)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    }

    this.orgMemberSlugToIndex.clear();
    this.teamMembersToShow.forEach((teamMember, index) => {
      this.orgMemberSlugToIndex.set(teamMember.orgMember.slug, index);
    });
  }

  /**
   * Generate the value for `roleOptions` based on the current value of `orgMember` and `teamMember`.
   */
  private generateRoleOptions(): void {
    this.roleOptions = generateLteTeamRoles(
      this.orgMember.role,
      this.teamMember?.role ?? null,
    ).map((role) => new SelectOption(role, role));
  }
}
