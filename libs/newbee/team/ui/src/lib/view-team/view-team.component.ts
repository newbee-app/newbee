import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  SearchResultComponent,
  ViewAllBtnComponent,
  ViewAllCardBtnComponent,
} from '@newbee/newbee/shared/ui';
import { SearchResultFormat, ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  apiRoles,
  checkRoles,
  type OrgMember,
  type Organization,
  type TeamMember,
  type TeamNoOrg,
} from '@newbee/shared/util';
import dayjs from 'dayjs';

/**
 * The dumb UI for viewing the details of a team.
 */
@Component({
  selector: 'newbee-view-team',
  standalone: true,
  imports: [
    CommonModule,
    ViewAllBtnComponent,
    ViewAllCardBtnComponent,
    SearchResultComponent,
  ],
  templateUrl: './view-team.component.html',
})
export class ViewTeamComponent {
  readonly keyword = Keyword;
  readonly shortUrl = ShortUrl;
  readonly searchResultFormat = SearchResultFormat;
  readonly apiRoles = apiRoles;
  readonly checkRoles = checkRoles;

  /**
   * The organization the team is in.
   */
  @Input() organization!: Organization;

  /**
   * The org member viewing the team.
   */
  @Input() orgMember!: OrgMember;

  /**
   * Information about the team we're looking at.
   */
  @Input() team!: TeamNoOrg;

  /**
   * The role the current user holds in the team, if any.
   */
  @Input() teamMember: TeamMember | null = null;

  /**
   * Where to navigate to, relative to the current org.
   */
  @Output() orgNavigate = new EventEmitter<string>();

  /**
   * Where to navigate to, relative to the current team.
   */
  @Output() teamNavigate = new EventEmitter<string>();

  /**
   * The team's up-to-date duration as a string.
   */
  get teamDurationStr(): string {
    return dayjs
      .duration(
        this.team.team.upToDateDuration ?? this.organization.upToDateDuration,
      )
      .humanize();
  }

  /**
   * A string detailing how many users are members of the team.
   */
  get totalMembers(): string {
    return `${this.team.teamMembers.length} ${
      this.team.teamMembers.length === 1 ? 'member' : 'members'
    }`;
  }

  /**
   * A string detailing how many qnas belong to the team.
   */
  get totalQnas(): string {
    return `${this.team.qnas.total} ${
      this.team.qnas.total === 1 ? 'QnA' : 'QnAs'
    }`;
  }

  /**
   * A string detailing how many docs belong to the team.
   */
  get totalDocs(): string {
    return `${this.team.docs.total} ${
      this.team.docs.total === 1 ? 'doc' : 'docs'
    }`;
  }
}
