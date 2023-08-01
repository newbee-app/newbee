import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { teamFeature } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';

/**
 * The smart UI for the view team screen.
 */
@Component({
  selector: 'newbee-team-view',
  templateUrl: './team-view.component.html',
})
export class TeamViewComponent {
  /**
   * The team to view.
   */
  selectedTeam$ = this.store.select(teamFeature.selectSelectedTeam);

  /**
   * The user's role in the team, if they have any.
   */
  teamMember$ = this.store.select(teamFeature.selectTeamMember);

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  /**
   * Navigate to a path relative to the current org.
   *
   * @param path The path to navigate to.
   */
  async onOrgNavigate(path: string): Promise<void> {
    await this.router.navigate([`../../${path}`], { relativeTo: this.route });
  }

  /**
   * Navigate to a path relative to the current team.
   *
   * @param path The path to navigate to.
   */
  async onTeamNavigate(path: string): Promise<void> {
    await this.router.navigate([`./${path}`], { relativeTo: this.route });
  }
}