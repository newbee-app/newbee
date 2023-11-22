import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  userHasAnswerPermissions,
  userHasQuestionPermissions,
  userHasUpToDatePermissions,
} from '@newbee/newbee/qna/util';
import { AlertComponent, UpToDateBtnComponent } from '@newbee/newbee/shared/ui';
import {
  AlertType,
  HttpClientError,
  ShortUrl,
  getHttpClientErrorMsg,
} from '@newbee/newbee/shared/util';
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
  imports: [CommonModule, UpToDateBtnComponent, AlertComponent],
  templateUrl: './view-qna.component.html',
})
export class ViewQnaComponent {
  readonly keyword = Keyword;
  readonly shortUrl = ShortUrl;
  readonly userDisplayName = userDisplayName;
  readonly dayjs = dayjs;
  readonly alertType = AlertType;

  /**
   * HTTP client error.
   */
  @Input() httpClientError: HttpClientError | null = null;

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
   * Gets the HTTP client error message for the key.
   *
   * @param keys The key to look for.
   *
   * @returns The error message associated with the key.
   */
  httpClientErrorMsg(...keys: string[]): string {
    return getHttpClientErrorMsg(this.httpClientError, keys.join('-'));
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
