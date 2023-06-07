import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipComponent } from '@newbee/newbee/shared/ui';
import { UrlEndpoint } from '@newbee/shared/data-access';
import type { Organization, OrgMemberNoUser, User } from '@newbee/shared/util';
import { compareOrgRoles, OrgRoleEnum } from '@newbee/shared/util';
import { isEqual } from 'lodash-es';
import { AuthenticatedSidebarComponent } from '../sidebar';

/**
 * The authenticated version of the navbar.
 */
@Component({
  selector: 'newbee-authenticated-navbar',
  standalone: true,
  imports: [CommonModule, TooltipComponent, AuthenticatedSidebarComponent],
  templateUrl: './authenticated-navbar.component.html',
})
export class AuthenticatedNavbarComponent {
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
  @Input() orgMember: OrgMemberNoUser | null = null;

  /**
   * An event emitter that tells the parent component when a request has been made to navigate to a link.
   */
  @Output() navigateToLink = new EventEmitter<string>();

  /**
   * An event emitter that tells the parent component when a logout request has been made.
   */
  @Output() logout = new EventEmitter<void>();

  /**
   * All possible URL endpoints.
   */
  readonly urlEndpoint = UrlEndpoint;

  /**
   * Whether or not the user has at least `Moderator` permissions in the selected org.
   */
  get isAdmin(): boolean {
    if (!this.orgMember) {
      return false;
    }

    const { orgMember, organization } = this.orgMember;
    if (!isEqual(organization, this.selectedOrganization)) {
      return false;
    }

    if (compareOrgRoles(orgMember.role, OrgRoleEnum.Moderator) >= 0) {
      return true;
    }

    return false;
  }

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
   * Calls `navigateToLink.emit()` using the given routes, joined by backslashes.
   *
   * @param endpoints The endpoints of the route to navigate to.
   */
  emitNavigateToLink(...endpoints: string[]): void {
    this.navigateToLink.emit(`/${endpoints.join('/')}`);
  }

  /**
   * Calls `logout.emit()`.
   */
  emitLogout(): void {
    this.logout.emit();
  }
}
