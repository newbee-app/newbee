import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertComponent, UpToDateBtnComponent } from '@newbee/newbee/shared/ui';
import {
  AlertType,
  HttpClientError,
  RouteAndQueryParams,
  ShortUrl,
  getHttpClientErrorMsg,
} from '@newbee/newbee/shared/util';
import {
  Keyword,
  TeamMember,
  apiRoles,
  checkRoles,
  isUpToDate,
  maintainerIsCreator,
  userDisplayName,
  type DocNoOrg,
  type OrgMember,
} from '@newbee/shared/util';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * The dumb UI for viewing a doc.
 */
@Component({
  selector: 'newbee-view-doc',
  standalone: true,
  imports: [CommonModule, UpToDateBtnComponent, AlertComponent],
  templateUrl: './view-doc.component.html',
})
export class ViewDocComponent {
  readonly keyword = Keyword;
  readonly shortUrl = ShortUrl;
  readonly alertType = AlertType;
  readonly apiRoles = apiRoles;
  readonly checkRoles = checkRoles;
  readonly userDisplayName = userDisplayName;
  readonly dayjs = dayjs;

  /**
   * The roles needed to edit the doc or mark it as up-to-date.
   */
  readonly editAndUpToDateRoles = new Set(
    apiRoles.doc.update.concat(apiRoles.doc.markUpToDate),
  );

  /**
   * HTTP client error.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The doc to view.
   */
  @Input() doc!: DocNoOrg;

  /**
   * The role the current user holds in the post's org.
   */
  @Input() orgMember!: OrgMember;

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
  @Output() orgNavigate = new EventEmitter<RouteAndQueryParams>();

  /**
   * Where to navigate relative to the current doc.
   */
  @Output() docNavigate = new EventEmitter<RouteAndQueryParams>();

  /**
   * Mark the current doc as up-to-date.
   */
  @Output() markAsUpToDate = new EventEmitter<void>();

  /**
   * Whether the doc is up-to-date.
   */
  get upToDate(): boolean {
    return isUpToDate(this.doc.doc.outOfDateAt);
  }

  /**
   * Whether the doc's maintainer is the same as its creator.
   */
  get maintainerIsCreator(): boolean {
    return maintainerIsCreator(this.doc);
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
}
