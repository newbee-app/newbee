import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouteAndQueryParams, ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  OrgMember,
  Organization,
  apiRoles,
  checkRoles,
  userDisplayName,
  type User,
} from '@newbee/shared/util';
import {
  DropdownComponent,
  DropdownWithArrowComponent,
} from '../../../dropdown';
import { TextTooltipComponent } from '../../../tooltip';
import { AuthenticatedSidebarComponent } from '../sidebar';

/**
 * The authenticated version of the navbar.
 */
@Component({
  selector: 'newbee-authenticated-navbar',
  standalone: true,
  imports: [
    CommonModule,
    TextTooltipComponent,
    DropdownComponent,
    DropdownWithArrowComponent,
    AuthenticatedSidebarComponent,
  ],
  templateUrl: './authenticated-navbar.component.html',
})
export class AuthenticatedNavbarComponent {
  readonly keyword = Keyword;
  readonly shortUrl = ShortUrl;
  readonly apiRoles = apiRoles;
  readonly checkRoles = checkRoles;
  readonly userDisplayName = userDisplayName;

  /**
   * Any of the roles needed to display the create dropdown.
   */
  readonly createDropdownRoles = new Set(
    apiRoles.doc.create.concat(
      apiRoles.qna.create,
      apiRoles.team.create,
      apiRoles['org-member-invite'].invite,
    ),
  );

  /**
   * The display name of the logged in user.
   */
  @Input() user!: User;

  /**
   * The organizations of the logged in user, as select options.
   */
  @Input() organizations!: Organization[];

  /**
   * The selected organization of the logged in user.
   */
  @Input() selectedOrganization: Organization | null = null;

  /**
   * An event emitter that tells the parent component when the selected organization has been changed.
   */
  @Output() selectedOrganizationChange = new EventEmitter<Organization>();

  /**
   * Information about the user in the `selectedOrganization`.
   */
  @Input() orgMember: OrgMember | null = null;

  /**
   * Whether to include the navbar-center that redirects to the org home.
   */
  @Input() includeCenter = false;

  /**
   * An event emitter that tells the parent component when a request has been made to navigate to a link.
   */
  @Output() navigateToLink = new EventEmitter<RouteAndQueryParams>();

  /**
   * An event emitter that tells the parent component when a logout request has been made.
   */
  @Output() logout = new EventEmitter<void>();

  /**
   * Selects the given organization as the selectedOrganization and emits the change.
   *
   * @param organization The organization to select.
   */
  selectOrganization(organization: Organization): void {
    this.selectedOrganization = organization;
    this.selectedOrganizationChange.emit(organization);
  }

  /**
   * Calls `logout.emit()`.
   */
  emitLogout(): void {
    this.logout.emit();
  }
}
