import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertComponent, UpToDateBtnComponent } from '@newbee/newbee/shared/ui';
import {
  AlertType,
  HttpClientError,
  ShortUrl,
  getHttpClientErrorMsg,
} from '@newbee/newbee/shared/util';
import {
  Keyword,
  TeamMember,
  apiRoles,
  checkRoles,
  isUpToDate,
  userDisplayName,
  type OrgMember,
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
  readonly alertType = AlertType;
  readonly apiRoles = apiRoles;
  readonly checkRoles = checkRoles;
  readonly userDisplayName = userDisplayName;
  readonly dayjs = dayjs;

  /**
   * The roles to edit the question or mark the qna as up-to-date.
   */
  readonly questionAndUpToDateRoles = new Set(
    apiRoles.qna.updateQuestion.concat(apiRoles.qna.markUpToDate),
  );

  /**
   * HTTP client error.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The qna to view.
   */
  @Input() qna!: QnaNoOrg;

  /**
   * The role the current user holds in the qna's org.
   */
  @Input() orgMember!: OrgMember;

  /**
   * The role the current user holds in the qna's team, if any.
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
    return isUpToDate(this.qna.qna.outOfDateAt);
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
