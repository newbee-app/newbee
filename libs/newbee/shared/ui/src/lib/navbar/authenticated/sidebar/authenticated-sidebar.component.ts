import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouteAndQueryParams, ShortUrl } from '@newbee/newbee/shared/util';
import { Keyword, Organization } from '@newbee/shared/util';
import { isEqual } from 'lodash-es';
import { TextTooltipComponent } from '../../../tooltip';

/**
 * The authenticated sidebar, for selecting an organization.
 */
@Component({
  selector: 'newbee-authenticated-sidebar',
  standalone: true,
  imports: [CommonModule, TextTooltipComponent],
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
  @Output() navigateToLink = new EventEmitter<RouteAndQueryParams>();

  /**
   * All NewBee keywords.
   */
  readonly keyword = Keyword;

  /**
   * All NewBee short URLs.
   */
  readonly shortUrl = ShortUrl;

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
      .join('')
      .slice(0, 4);
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
}
