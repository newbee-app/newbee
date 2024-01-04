import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { organizationFeature } from '@newbee/newbee/shared/data-access';
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
   * @param path The path to navigate to.
   */
  async onOrgNavigate(path: string): Promise<void> {
    await this.router.navigate([`../${path}`], { relativeTo: this.route });
  }
}
