import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  TeamActions,
  httpFeature,
  organizationFeature,
  teamFeature,
} from '@newbee/newbee/shared/data-access';
import { RouteAndQueryParams } from '@newbee/newbee/shared/util';
import {
  selectNonTeamOrgMembers,
  teamFeature as teamModuleFeature,
} from '@newbee/newbee/team/data-access';
import {
  BaseCreateTeamMemberDto,
  BaseUpdateTeamMemberDto,
} from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI for viewing all team members.
 */
@Component({
  selector: 'newbee-team-members-view',
  templateUrl: './team-members-view.component.html',
})
export class TeamMembersViewComponent {
  /**
   * The org state.
   */
  orgState$ = this.store.select(organizationFeature.selectOrgState);

  /**
   * The team state.
   */
  teamState$ = this.store.select(teamFeature.selectTeamState);

  /**
   * All of the org members of the currently selected org who are not members of the currently selected team.
   */
  nonTeamOrgMembers$ = this.store.select(selectNonTeamOrgMembers);

  /**
   * The team module state.
   */
  teamModuleState$ = this.store.select(teamModuleFeature.selectTeamModuleState);

  /**
   * The HTTP client error.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  /**
   * Send a request to create a new team member using the given details.
   *
   * @param createTeamMemberDto The details for the new team member.
   */
  onAddTeamMember(createTeamMemberDto: BaseCreateTeamMemberDto): void {
    this.store.dispatch(TeamActions.addTeamMember({ createTeamMemberDto }));
  }

  /**
   * Send a request to update an existing team member using the given details.
   *
   * @param editDetails The details for which team member to edit and with what information.
   */
  onEditTeamMember(editDetails: {
    orgMemberSlug: string;
    updateTeamMemberDto: BaseUpdateTeamMemberDto;
  }): void {
    const { orgMemberSlug, updateTeamMemberDto } = editDetails;
    this.store.dispatch(
      TeamActions.editTeamMember({ orgMemberSlug, updateTeamMemberDto }),
    );
  }

  /**
   * Send a request to delete a team member with the given org member slug.
   *
   * @param orgMemberSlug The org member slug of the team member to remove from the team.
   */
  onDeleteTeamMember(orgMemberSlug: string): void {
    this.store.dispatch(TeamActions.deleteTeamMember({ orgMemberSlug }));
  }

  /**
   * Navigate relative to the selected organization.
   *
   * @param routeAndQueryParams The route and query params to navigate to, relative to the selected organization.
   */
  async onOrgNavigate(routeAndQueryParams: RouteAndQueryParams): Promise<void> {
    const { route, queryParams } = routeAndQueryParams;
    await this.router.navigate([`../../../${route}`], {
      relativeTo: this.route,
      ...(queryParams && { queryParams }),
    });
  }
}
