import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { organizationFeature } from '@newbee/newbee/shared/data-access';
import { RouteAndQueryParams } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI for viewing all of the teams in an org.
 */
@Component({
  selector: 'newbee-teams-view',
  templateUrl: './teams-view.component.html',
})
export class TeamsViewComponent {
  /**
   * The org state.
   */
  orgState$ = this.store.select(organizationFeature.selectOrgState);

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  /**
   * Navigate to the given path relative to the currently selected org.
   *
   * @param routeAndQueryParams The route and query params to navigate to.
   */
  async onOrgNavigate(routeAndQueryParams: RouteAndQueryParams): Promise<void> {
    const { route, queryParams } = routeAndQueryParams;
    await this.router.navigate([`../${route}`], {
      relativeTo: this.route,
      ...(queryParams && { queryParams }),
    });
  }
}
