import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { organizationFeature } from '@newbee/newbee/shared/data-access';
import { RouteAndQueryParams } from '@newbee/newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI for viewing all of an org member's teams.
 */
@Component({
  selector: 'newbee-org-member-teams-view',
  templateUrl: './org-member-teams-view.component.html',
})
export class OrgMemberTeamsViewComponent {
  /**
   * The org member whose teams to view.
   */
  orgMember$ = this.store.select(organizationFeature.selectOrgMember);

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
    await this.router.navigate([`../../../${route}`], {
      relativeTo: this.route,
      ...(queryParams && { queryParams }),
    });
  }
}
