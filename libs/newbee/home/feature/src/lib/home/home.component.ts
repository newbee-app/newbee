import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { organizationFeature } from '@newbee/newbee/shared/data-access';
import { RouteAndQueryParams } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI for the home screen.
 */
@Component({
  selector: 'newbee-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  /**
   * The organizations the user is a part of.
   */
  organizations$ = this.store.select(organizationFeature.selectOrganizations);

  constructor(
    private readonly store: Store,
    private readonly router: Router,
  ) {}

  /**
   * Takes a `navigateToLink` request from the dumb UI and passes it to the router.
   *
   * @param link The link to navigate to.
   */
  async navigateToLink(
    routeAndQueryParams: RouteAndQueryParams,
  ): Promise<void> {
    const { route, queryParams } = routeAndQueryParams;
    await this.router.navigate([route], {
      ...(queryParams && { queryParams }),
    });
  }
}
