import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  DropdownComponent,
  SearchResultComponent,
  ViewAllBtnComponent,
  ViewAllCardBtnComponent,
} from '@newbee/newbee/shared/ui';
import { SearchResultFormat, ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  TeamRoleEnum,
  compareTeamRoles,
  nbDayjs,
  type Organization,
  type TeamMember,
  type TeamNoOrg,
} from '@newbee/shared/util';

/**
 * The dumb UI for viewing the details of a team.
 */
@Component({
  selector: 'newbee-view-team',
  standalone: true,
  imports: [
    CommonModule,
    DropdownComponent,
    ViewAllBtnComponent,
    ViewAllCardBtnComponent,
    SearchResultComponent,
  ],
  templateUrl: './view-team.component.html',
})
export class ViewTeamComponent {
  /**
   * All NewBee keywords.
   */
  readonly keyword = Keyword;

  /**
   * All NewBee short URLs.
   */
  readonly shortUrl = ShortUrl;

  /**
   * All search result display formats.
   */
  readonly searchResultFormat = SearchResultFormat;

  /**
   * The organization the team is in.
   */
  @Input() organization!: Organization;

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
    return nbDayjs
      .duration(
        this.team.team.upToDateDuration ?? this.organization.upToDateDuration,
      )
      .humanize();
  }

  /**
   * A string detailing how many users are members of the team.
   */
  get totalMembers(): string {
    return `${this.team.teamMembers.total} ${
      this.team.teamMembers.total === 1 ? 'member' : 'members'
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

  /**
   * Whether the current user has at least moderator level team permissions.
   */
  get isAdmin(): boolean {
    return !!(
      this.teamMember &&
      compareTeamRoles(TeamRoleEnum.Moderator, this.teamMember.role) <= 0
    );
  }
}
