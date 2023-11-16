import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UpToDateBtnComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  OrgMember,
  OrgRoleEnum,
  TeamMember,
  TeamRoleEnum,
  compareOrgRoles,
  compareTeamRoles,
  userDisplayName,
  type QnaNoOrg,
} from '@newbee/shared/util';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * The dumb UI component for viewing a qna.
 */
@Component({
  selector: 'newbee-view-qna',
  standalone: true,
  imports: [CommonModule, UpToDateBtnComponent],
  templateUrl: './view-qna.component.html',
})
export class ViewQnaComponent {
  /**
   * NewBee keywords.
   */
  readonly keyword = Keyword;

  /**
   * NewBee short URLs.
   */
  readonly shortUrl = ShortUrl;

  /**
   * Helper function for displaying user names.
   */
  readonly userDisplayName = userDisplayName;

  /**
   * Dayjs.
   */
  readonly dayjs = dayjs;

  /**
   * The qna to view.
   */
  @Input() qna!: QnaNoOrg;

  /**
   * The role the current user holds in the post's org, if any.
   */
  @Input() orgMember: OrgMember | null = null;

  /**
   * The role the current user holds in the post's team, if any.
   */
  @Input() teamMember: TeamMember | null = null;

  /**
   * Whether the up-to-date action is pending.
   */
  @Input() upToDatePending = false;

  /**
   * Where to navigate relative to the selected org.
   */
  @Output() orgNavigate = new EventEmitter<string>();

  /**
   * Where to navigate relative to the current qna.
   */
  @Output() qnaNavigate = new EventEmitter<string>();

  /**
   * Mark the current qna as up-to-date.
   */
  @Output() markAsUpToDate = new EventEmitter<void>();

  /**
   * Whether the qna is up-to-date.
   */
  get upToDate(): boolean {
    return new Date() < new Date(this.qna.qna.outOfDateAt);
  }

  /**
   * Whether the user has the permissions to edit the question in some capacity.
   */
  get hasEditQuestionPermissions(): boolean {
    return !!(
      (this.orgMember &&
        (compareOrgRoles(this.orgMember.role, OrgRoleEnum.Moderator) >= 0 ||
          [
            this.qna.creator?.orgMember.slug,
            this.qna.maintainer?.orgMember.slug,
          ].includes(this.orgMember.slug))) ||
      (this.qna.team &&
        this.teamMember &&
        compareTeamRoles(this.teamMember.role, TeamRoleEnum.Moderator) >= 0)
    );
  }

  /**
   * Whether the user has the permissions to edit the answer in some capacity.
   */
  get hasEditAnswerPermissions(): boolean {
    return !!(
      (this.orgMember &&
        (compareOrgRoles(
          this.orgMember.role,
          this.qna.team || this.qna.maintainer
            ? OrgRoleEnum.Moderator
            : OrgRoleEnum.Member,
        ) >= 0 ||
          this.qna.maintainer?.orgMember.slug === this.orgMember.slug)) ||
      (this.qna.team &&
        this.teamMember &&
        compareTeamRoles(
          this.teamMember.role,
          this.qna.maintainer ? TeamRoleEnum.Moderator : TeamRoleEnum.Member,
        ) >= 0)
    );
  }

  /**
   * Whether the user has the permissions to mark the qna as up-to-date.
   */
  get hasUpToDatePermissions(): boolean {
    return !!(
      (this.orgMember &&
        (compareOrgRoles(this.orgMember.role, OrgRoleEnum.Moderator) >= 0 ||
          this.orgMember.slug === this.qna.maintainer?.orgMember.slug)) ||
      (this.qna.team &&
        this.teamMember &&
        compareTeamRoles(this.teamMember.role, TeamRoleEnum.Moderator) >= 0)
    );
  }

  /**
   * Whether the answer box should be colored green or red.
   */
  get borderSuccess(): boolean {
    return this.upToDate && !!this.qna.qna.answerHtml;
  }

  /**
   * Emit orgNavigate using the given path.
   *
   * @param paths The paths to join before emitting.
   */
  emitOrgNavigate(...paths: string[]): void {
    this.orgNavigate.emit(`/${paths.join('/')}`);
  }

  /**
   * Emit qnaNavigate using the given path.
   *
   * @param paths The paths to join before emitting.
   */
  emitQnaNavigate(...paths: string[]): void {
    this.qnaNavigate.emit(`/${paths.join('/')}`);
  }
}
