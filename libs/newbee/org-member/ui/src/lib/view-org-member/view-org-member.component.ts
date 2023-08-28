import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  DocSearchResultComponent,
  DropdownComponent,
  QnaSearchResultComponent,
  SearchableSelectComponent,
  TeamSearchResultComponent,
  ViewAllBtnComponent,
  ViewAllCardBtnComponent,
} from '@newbee/newbee/shared/ui';
import {
  PhoneNumberPipeModule,
  SelectOption,
  ShortUrl,
} from '@newbee/newbee/shared/util';
import {
  compareOrgRoles,
  Keyword,
  OrgRoleEnum,
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
    DropdownComponent,
    ViewAllBtnComponent,
    ViewAllCardBtnComponent,
    SearchableSelectComponent,
    TeamSearchResultComponent,
    DocSearchResultComponent,
    QnaSearchResultComponent,
  ],
  templateUrl: './view-org-member.component.html',
})
export class ViewOrgMemberComponent implements OnInit {
  /**
   * All NewBee keywords.
   */
  readonly keyword = Keyword;

  /**
   * All NewBee short URLs.
   */
  readonly shortUrl = ShortUrl;

  /**
   * The select form control for changing the org member's role.
   */
  changeRoleSelect = this.fb.control(null as OrgRoleEnum | null);

  /**
   * The org member we're looking at.
   */
  @Input() orgMember!: OrgMemberNoOrg;

  /**
   * The org member information of the user who's looking at the page.
   */
  @Input() userOrgMember: OrgMember | null = null;

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
  @Output() orgNavigate = new EventEmitter<string>();

  /**
   * Where to navigate to, relative to the current org member.
   */
  @Output() memberNavigate = new EventEmitter<string>();

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
    return `${this.orgMember.teams.total} ${
      this.orgMember.teams.total === 1 ? 'team' : 'teams'
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

  /**
   * Whether the user looking at the page can edit the org member's role or remove the user from the org.
   */
  get canEdit(): boolean {
    if (!this.userOrgMember) {
      return false;
    }

    return (
      compareOrgRoles(this.userOrgMember.role, OrgRoleEnum.Moderator) >= 0 &&
      compareOrgRoles(this.userOrgMember.role, this.orgMember.orgMember.role) >=
        0
    );
  }

  /**
   * The roles the user can change the org member to, as select options.
   * The user cannot give the org member a role that is higher than their own.
   */
  get orgRoleEnumOptions(): SelectOption<OrgRoleEnum>[] {
    return Object.values(OrgRoleEnum)
      .filter(
        (role) =>
          this.userOrgMember &&
          compareOrgRoles(role, this.userOrgMember.role) <= 0
      )
      .map((role) => new SelectOption(role, role));
  }

  constructor(private readonly fb: FormBuilder) {}

  /**
   * Set the change role select with an initial value that matches the org member's role.
   */
  ngOnInit(): void {
    this.changeRoleSelect.setValue(this.orgMember.orgMember.role);
  }

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
