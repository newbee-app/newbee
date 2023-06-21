import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipComponent } from '@newbee/newbee/shared/ui';
import { UrlEndpoint } from '@newbee/shared/data-access';
import type { Organization } from '@newbee/shared/util';
import { isEqual } from 'lodash-es';

/**
 * The authenticated sidebar, for selecting an organization.
 */
@Component({
  selector: 'newbee-authenticated-sidebar',
  standalone: true,
  imports: [CommonModule, TooltipComponent],
  templateUrl: './authenticated-sidebar.component.html',
})
export class AuthenticatedSidebarComponent {
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
   * An event emitter that tells the parent component when a request has been made to navigate to a link.
   */
  @Output() navigateToLink = new EventEmitter<string>();

  /**
   * All possible URL endpoints.
   */
  readonly urlEndpoint = UrlEndpoint;

  /**
   * Checks if two variables are equal.
   */
  readonly isEqual = isEqual;

  /**
   * Takes in an org name and shortens it into a string for display on the sidebar buttons.
   * e.g. NewBee => N, Hello World => HW, My cool Org => McO.
   *
   * @param orgName The org name to transform.
   *
   * @returns The org name shortened for display on the sidebar.
   */
  shortenOrgName(orgName: string): string {
    return orgName
      .split(' ')
      .map((word) => word[0])
      .join('');
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
}
