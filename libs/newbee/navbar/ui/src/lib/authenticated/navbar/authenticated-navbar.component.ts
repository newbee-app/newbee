import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShortUrl } from '@newbee/newbee/shared/data-access';
import { DropdownComponent, TooltipComponent } from '@newbee/newbee/shared/ui';
import {
  compareOrgRoles,
  Keyword,
  Organization,
  OrgMemberNoUserOrg,
  OrgRoleEnum,
  type User,
} from '@newbee/shared/util';
import { AuthenticatedSidebarComponent } from '../sidebar';

/**
 * The authenticated version of the navbar.
 */
@Component({
  selector: 'newbee-authenticated-navbar',
  standalone: true,
  imports: [
    CommonModule,
    TooltipComponent,
    DropdownComponent,
    AuthenticatedSidebarComponent,
  ],
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
  @Input() orgMember: OrgMemberNoUserOrg | null = null;

  /**
   * An event emitter that tells the parent component when a request has been made to navigate to a link.
   */
  @Output() navigateToLink = new EventEmitter<string>();

  /**
   * An event emitter that tells the parent component when a logout request has been made.
   */
  @Output() logout = new EventEmitter<void>();

  /**
   * All NewBee keywords.
   */
  readonly keyword = Keyword;

  /**
   * All NewBee short URLs.
   */
  readonly shortUrl = ShortUrl;

  /**
   * Whether or not the user has at least `Moderator` permissions in the selected org.
   */
  get isAdmin(): boolean {
    if (!this.orgMember) {
      return false;
    }

    const { orgMember } = this.orgMember;
    return compareOrgRoles(orgMember.role, OrgRoleEnum.Moderator) >= 0;
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
