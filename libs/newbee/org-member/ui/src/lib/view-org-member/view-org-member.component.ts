import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  SearchResultComponent,
  SearchableSelectComponent,
  ViewAllBtnComponent,
  ViewAllCardBtnComponent,
} from '@newbee/newbee/shared/ui';
import {
  PhoneNumberPipeModule,
  RouteAndQueryParams,
  SearchResultFormat,
  SelectOption,
  ShortUrl,
} from '@newbee/newbee/shared/util';
import {
  Keyword,
  OrgRoleEnum,
  apiRoles,
  checkRoles,
  generateLteOrgRoles,
  userDisplayName,
  type OrgMember,
  type OrgMemberNoOrg,
} from '@newbee/shared/util';

/**
 * The dumb UI for viewing the details of an org member.
 */
@Component({
  selector: 'newbee-view-org-member',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PhoneNumberPipeModule,
    ViewAllBtnComponent,
    ViewAllCardBtnComponent,
    SearchableSelectComponent,
    SearchResultComponent,
  ],
  templateUrl: './view-org-member.component.html',
})
export class ViewOrgMemberComponent {
  readonly keyword = Keyword;
  readonly shortUrl = ShortUrl;
  readonly searchResultFormat = SearchResultFormat;
  readonly apiRoles = apiRoles;
  readonly checkRoles = checkRoles;
  readonly userDisplayName = userDisplayName;

  /**
   * The roles the user can change the org member to, as select options.
   * The user cannot give the org member a role that is higher than their own.
   */
  orgRoleEnumOptions: SelectOption<OrgRoleEnum>[] = [];

  /**
   * The select form control for changing the org member's role.
   */
  changeRoleSelect = this.fb.control(null as OrgRoleEnum | null);

  /**
   * The org member we're looking at.
   */
  @Input()
  get orgMember(): OrgMemberNoOrg {
    return this._orgMember;
  }
  set orgMember(orgMember: OrgMemberNoOrg) {
    this._orgMember = orgMember;
    this.changeRoleSelect.setValue(this.orgMember.orgMember.role, {
      emitEvent: false,
    });
  }
  private _orgMember!: OrgMemberNoOrg;

  /**
   * The org member information of the user who's looking at the page.
   */
  @Input()
  get userOrgMember(): OrgMember {
    return this._userOrgMember;
  }
  set userOrgMember(userOrgMember: OrgMember) {
    this._userOrgMember = userOrgMember;
    this.orgRoleEnumOptions = generateLteOrgRoles(this.userOrgMember.role).map(
      (role) => new SelectOption(role, role),
    );
  }
  private _userOrgMember!: OrgMember;

  /**
   * Whether to display a loader for the org member's role.
   */
  @Input() editPending = false;

  /**
   * Whether to display a loader for the whole screen.
   */
  @Input() deletePending = false;

  /**
   * Where to navigate to, relative to the current org.
   */
  @Output() orgNavigate = new EventEmitter<RouteAndQueryParams>();

  /**
   * Where to navigate to, relative to the current org member.
   */
  @Output() memberNavigate = new EventEmitter<RouteAndQueryParams>();

  /**
   * Edit the role of the org member to the new value.
   */
  @Output() editRole = new EventEmitter<OrgRoleEnum>();

  /**
   * Delete the org member.
   */
  @Output() delete = new EventEmitter<void>();

  /**
   * A string detailing how many teams the org member is in.
   */
  get totalTeams(): string {
    return `${this.orgMember.teams.length} ${
      this.orgMember.teams.length === 1 ? 'team' : 'teams'
    }`;
  }

  /**
   * A string detailing how many qnas the org member created.
   */
  get totalCreatedQnas(): string {
    return `${this.orgMember.createdQnas.total} ${
      this.orgMember.createdQnas.total === 1 ? 'QnA' : 'QnAs'
    }`;
  }

  /**
   * A string detailing how many qnas the org member maintains.
   */
  get totalMaintainedQnas(): string {
    return `${this.orgMember.maintainedQnas.total} ${
      this.orgMember.maintainedQnas.total === 1 ? 'QnA' : 'QnAs'
    }`;
  }

  /**
   * A string detailing how many docs the org member created.
   */
  get totalCreatedDocs(): string {
    return `${this.orgMember.createdDocs.total} ${
      this.orgMember.createdDocs.total === 1 ? 'doc' : 'docs'
    }`;
  }

  /**
   * A string detailing how many docs the org member maintains.
   */
  get totalMaintainedDocs(): string {
    return `${this.orgMember.maintainedDocs.total} ${
      this.orgMember.maintainedDocs.total === 1 ? 'doc' : 'docs'
    }`;
  }

  constructor(private readonly fb: FormBuilder) {}

  /**
   * Emit `editRole` with the current value of the change role select, so long as it's not null nor the same value.
   */
  editOrgMemberRole(): void {
    const role = this.changeRoleSelect.value;
    if (!role) {
      return;
    } else if (role === this.orgMember.orgMember.role) {
      return;
    }

    return this.editRole.emit(role);
  }
}
