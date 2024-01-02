import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  AuthActions,
  authFeature,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { AuthenticatedNavbarComponent } from '@newbee/newbee/shared/ui';
import { ShortUrl } from '@newbee/newbee/shared/util';
import type { Organization } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { Subject, combineLatest, takeUntil } from 'rxjs';

/**
 * The smart UI for the navbar.
 * Displays the authenticated navbar or the unauthenticated navbar based on the store.
 */
@Component({
  selector: 'newbee-navbar',
  standalone: true,
  imports: [CommonModule, AuthenticatedNavbarComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnDestroy {
  /**
   * Emit to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * The logged in user.
   */
  user$ = this.store.select(authFeature.selectUser);

  /**
   * The org portion of the global state.
   */
  orgState$ = this.store.select(organizationFeature.selectOrgState);

  /**
   * Whether to include the center piece of the authenticated navbar.
   */
  includeCenter = false;

  /**
   * Look at the current URL, selected organization, and adjust `includeCenter` to `true` if it's past the org's home page.
   */
  constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {
    combineLatest([
      this.router.events,
      store.select(organizationFeature.selectSelectedOrganization),
    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: ([event, selectedOrganization]) => {
          if (!(event instanceof NavigationEnd)) {
            return;
          } else if (!selectedOrganization) {
            this.includeCenter = false;
            return;
          } else if (
            event.url ===
            `/${ShortUrl.Organization}/${selectedOrganization.organization.slug}`
          ) {
            this.includeCenter = false;
            return;
          }

          this.includeCenter = true;
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
    await this.router.navigate([
      `/${ShortUrl.Organization}/${organization.slug}`,
    ]);
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
