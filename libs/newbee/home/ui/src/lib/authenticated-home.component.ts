import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthenticatedNavbarComponent } from '@newbee/newbee/navbar/ui';
import { SearchbarComponent } from '@newbee/newbee/shared/ui';
import { RouteKeyword, SelectOption } from '@newbee/newbee/shared/util';

/**
 * The authenticated version of the home screen.
 */
@Component({
  selector: 'newbee-authenticated-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthenticatedNavbarComponent,
    SearchbarComponent,
  ],
  templateUrl: './authenticated-home.component.html',
})
export class AuthenticatedHomeComponent {
  /**
   * The display name of the logged in user.
   */
  @Input() userDisplayName!: string;

  /**
   * The organizations of the logged in user.
   */
  @Input() organizations!: SelectOption<string>[];

  /**
   * The current organization of the logged in user.
   */
  @Input() selectedOrganization: SelectOption<string> | null = null;

  /**
   * The event emitter that tells the parent component which organization has been selected.
   */
  @Output() selectedOrganizationChange =
    new EventEmitter<SelectOption<string> | null>();

  /**
   * The event emitter that tells the parent component when a search has been fired off.
   */
  @Output() search = new EventEmitter<string>();

  /**
   * The event emitter that tells the parent component when the user has typed into the searchbar, so suggestions can be fetched.
   */
  @Output() suggest = new EventEmitter<string>();

  /**
   * The event emitter that tells the parent component what route to navigate to.
   */
  @Output() navigateToLink = new EventEmitter<RouteKeyword>();

  /**
   * The event emitter that tells the parent component to log out the logged in user.
   */
  @Output() logout = new EventEmitter<void>();

  /**
   * The search term coming from the searchbar.
   */
  searchTerm = new FormControl('');

  /**
   * All of the keywords that represent routes.
   */
  readonly routeKeyword = RouteKeyword;

  /**
   * Whether organizations have been fed in to the component.
   */
  get hasOrgs(): boolean {
    return !!this.organizations.length;
  }

  /**
   * Whether an organization has been selected.
   */
  get orgSelected(): boolean {
    return !!this.selectedOrganization;
  }

  /**
   * Emit the search event with the current search value.
   */
  emitSearch(event: SubmitEvent): void {
    event.preventDefault();
    if (!this.searchTerm.value) {
      return;
    }

    this.search.emit(this.searchTerm.value);
  }
}
