import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthenticatedNavbarComponent,
  UnauthenticatedNavbarComponent,
} from '@newbee/newbee/navbar/ui';
import {
  AuthActions,
  authFeature,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import type { Organization, OrgMemberNoUser } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { isEqual } from 'lodash-es';
import { Subject, takeUntil } from 'rxjs';

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
export class NavbarComponent implements OnInit, OnDestroy {
  /**
   * Emit to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

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
  selectedOrganization: OrgMemberNoUser | null = null;

  constructor(private readonly store: Store, private readonly router: Router) {}

  /**
   * Subscribe to selectedOrganization in state.
   */
  ngOnInit(): void {
    this.store
      .select(organizationFeature.selectSelectedOrganization)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (selectedOrganization) => {
          this.selectedOrganization = selectedOrganization;
        },
      });
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * When the dumb UI emits a `selectedOrganizationChange` event, pass it to the router.
   *
   * @param organization The organization to select.
   */
  async selectOrganization(organization: Organization): Promise<void> {
    if (isEqual(organization, this.selectedOrganization?.organization)) {
      return;
    }

    await this.router.navigate([`/${organization.slug}`]);
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
