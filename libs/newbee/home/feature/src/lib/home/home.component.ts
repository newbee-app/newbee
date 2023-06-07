import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  OrganizationActions,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import type { Organization } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';

/**
 * The smart UI for the home screen.
 */
@Component({
  selector: 'newbee-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  /**
   * Emits to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * The organizations the user is a part of.
   */
  organizations: Organization[] = [];

  constructor(private readonly store: Store, private readonly router: Router) {}

  /**
   * Subscribe to the store to keep `organizations` and `selectedOrganizations` up to date.
   */
  ngOnInit(): void {
    this.store.dispatch(OrganizationActions.resetSelectedOrg());

    this.store
      .select(organizationFeature.selectOrganizations)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (organizations) => {
          this.organizations = organizations;
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
   * Whether organizationOptions is empty.
   */
  get noOrg(): boolean {
    return !this.organizations.length;
  }

  /**
   * Takes a `navigateToLink` request from the dumb UI and passes it to the router.
   *
   * @param link The link to navigate to.
   */
  async navigateToLink(link: string): Promise<void> {
    await this.router.navigate([link]);
  }
}
