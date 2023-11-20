import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  userHasAnswerPermissions,
  userHasQuestionPermissions,
  userHasUpToDatePermissions,
} from '@newbee/newbee/qna/util';
import { UpToDateBtnComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  OrgMember,
  TeamMember,
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
  get hasQuestionPermissions(): boolean {
    return userHasQuestionPermissions(
      this.qna,
      this.orgMember,
      this.teamMember,
    );
  }

  /**
   * Whether the user has the permissions to edit the answer in some capacity.
   */
  get hasAnswerPermissions(): boolean {
    return userHasAnswerPermissions(this.qna, this.orgMember, this.teamMember);
  }

  /**
   * Whether the user has the permissions to mark the qna as up-to-date.
   */
  get hasUpToDatePermissions(): boolean {
    return userHasUpToDatePermissions(
      this.qna,
      this.orgMember,
      this.teamMember,
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
