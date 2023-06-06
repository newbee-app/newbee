import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthenticatedNavbarComponent,
  UnauthenticatedNavbarComponent,
} from '@newbee/newbee/navbar/ui';
import {
  AuthActions,
  authFeature,
  OrganizationActions,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import type { Organization } from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI for the navbar.
 * Displays the authenticated navbar or the unauthenticated navbar based on the store.
 */
@Component({
  selector: 'newbee-navbar',
  standalone: true,
  imports: [
    CommonModule,
    AuthenticatedNavbarComponent,
    UnauthenticatedNavbarComponent,
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  /**
   * The logged in user.
   */
  user$ = this.store.select(authFeature.selectUser);

  /**
   * The organizations of the logged in user.
   */
  organizations$ = this.store.select(organizationFeature.selectOrganizations);

  /**
   * The selected organization of the logged in user.
   */
  selectedOrganization$ = this.store.select(
    organizationFeature.selectSelectedOrganization
  );

  constructor(private readonly store: Store, private readonly router: Router) {}

  /**
   * When the dumb UI emits a `selectedOrganizationChange` event, pass it to the store.
   *
   * @param organization The organization to select.
   */
  selectOrganization(organization: Organization): void {
    this.store.dispatch(
      OrganizationActions.getOrg({ orgSlug: organization.slug })
    );
  }

  /**
   * When the dumb UI emits a `navigateToLink` event, pass it to the router.
   *
   * @param link The link to navigate to.
   */
  async navigateToLink(link: string): Promise<void> {
    await this.router.navigate([link]);
  }

  /**
   * When the dumb UI emits a `logout` event, pass it to the store.
   */
  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
