import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  compareOrgRoles,
  Keyword,
  Organization,
  OrgMemberNoUserOrg,
  OrgRoleEnum,
  type User,
} from '@newbee/shared/util';
import { DropdownComponent } from '../../../dropdown';
import { SearchbarComponent } from '../../../form-control';
import { TooltipComponent } from '../../../tooltip';
import { AuthenticatedSidebarComponent } from '../sidebar';

/**
 * The authenticated version of the navbar.
 */
@Component({
  selector: 'newbee-authenticated-navbar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TooltipComponent,
    DropdownComponent,
    SearchbarComponent,
    AuthenticatedSidebarComponent,
  ],
  templateUrl: './authenticated-navbar.component.html',
})
export class AuthenticatedNavbarComponent implements OnInit {
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
   * Whether the current route is past the org home.
   *
   * e.g. `/o/newbee/edit`, `/o/newbee/t/development` should be `true`.
   *      `/`, `/o/newbee` should be `false`.
   */
  @Input() pastOrgHome = false;

  /**
   * The user's initial search term.
   */
  @Input() initialSearchTerm = '';

  /**
   * Suggestions for the searchbar.
   */
  @Input() searchSuggestions: string[] = [];

  /**
   * An event emitter that tells the parent component when a search request has been made.
   */
  @Output() search = new EventEmitter<string>();

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
   * The form group associated with the searchbar.
   */
  searchTerm = this.fb.group({ searchbar: [''] });

  constructor(private readonly fb: FormBuilder) {}

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
   * When the component is initialized, set searchbar to the value of initialSearchTerm.
   */
  ngOnInit(): void {
    this.searchTerm.setValue({ searchbar: this.initialSearchTerm });
  }

  /**
   * Takes in a suggestion and uses it to fire a search request.
   *
   * @param suggestion The suggestion to use.
   */
  selectSuggestion(suggestion: string): void {
    this.searchTerm.setValue({ searchbar: suggestion });
    this.emitSearch();
  }

  /**
   * Emit the search event with the current search value.
   */
  emitSearch(): void {
    const searchVal = this.searchTerm.controls.searchbar.value;
    if (!searchVal) {
      return;
    }

    return this.search.emit(searchVal);
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
