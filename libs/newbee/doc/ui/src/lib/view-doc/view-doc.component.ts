import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  userHasEditPermissions,
  userHasUpToDatePermissions,
} from '@newbee/newbee/doc/util';
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
  isUpToDate,
  maintainerIsCreator,
  userDisplayName,
  type DocNoOrg,
} from '@newbee/shared/util';
import dayjs from 'dayjs';

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
  readonly userDisplayName = userDisplayName;
  readonly dayjs = dayjs;
  readonly alertType = AlertType;

  /**
   * HTTP client error.
   */
  @Input() httpClientError: HttpClientError | null = null;

  /**
   * The doc to view.
   */
  @Input() doc!: DocNoOrg;

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
   * Where to navigate relative to the current doc.
   */
  @Output() docNavigate = new EventEmitter<string>();

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
   * Whether the user has the permissions to edit the doc.
   */
  get hasEditPermissions(): boolean {
    return userHasEditPermissions(this.doc, this.orgMember, this.teamMember);
  }

  /**
   * Whether the user has the permissions to the mark the doc as up-to-date.
   */
  get hasUpToDatePermissions(): boolean {
    return userHasUpToDatePermissions(
      this.doc,
      this.orgMember,
      this.teamMember,
    );
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
   * Emit docNavigate using the given path.
   *
   * @param paths The paths to join before emitting.
   */
  emitDocNavigate(...paths: string[]): void {
    this.docNavigate.emit(`/${paths.join('/')}`);
  }
}
