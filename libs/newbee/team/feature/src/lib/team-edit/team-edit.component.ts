import { Component } from '@angular/core';
import {
  httpFeature,
  organizationFeature,
  TeamActions,
  teamFeature,
} from '@newbee/newbee/shared/data-access';
import { teamFeature as teamModuleFeature } from '@newbee/newbee/team/data-access';
import { BaseUpdateTeamDto } from '@newbee/shared/util';
import { Store } from '@ngrx/store';

/**
 * The smart UI for the edit team screen.
 */
@Component({
  selector: 'newbee-team-edit',
  templateUrl: './team-edit.component.html',
})
export class TeamEditComponent {
  /**
   * The currently selected organization.
   */
  selectedOrganization$ = this.store.select(
    organizationFeature.selectSelectedOrganization,
  );

  /**
   * The currently selected team.
   */
  selectedTeam$ = this.store.select(teamFeature.selectSelectedTeam);

  /**
   * The user's relation to the currently selected org.
   */
  orgMember$ = this.store.select(organizationFeature.selectOrgMember);

  /**
   * The user's relation to the currently selected team, if any.
   */
  teamMember$ = this.store.select(teamFeature.selectTeamMember);

  /**
   * Whether the form's slug value is taken, excluding the slug for the currently selected team.
   */
  slugTaken$ = this.store.select(teamModuleFeature.selectSlugTaken);

  /**
   * Whether the edit action is pending.
   */
  editPending$ = this.store.select(teamModuleFeature.selectPendingEdit);

  /**
   * Whether the edit slug action is pending.
   */
  editSlugPending$ = this.store.select(teamModuleFeature.selectPendingEditSlug);

  /**
   * Whether the check slug action is pending.
   */
  checkPending$ = this.store.select(teamModuleFeature.selectPendingCheck);

  /**
   * Whether the delete team action is pending.
   */
  deletePending$ = this.store.select(teamModuleFeature.selectPendingDelete);

  /**
   * Request HTTP error, if any exist.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  constructor(private readonly store: Store) {}

  /**
   * When the dumb UI emits a slug event, dispatch it to the store.
   *
   * @param slug The slug to dispatch.
   */
  onSlug(slug: string): void {
    this.store.dispatch(TeamActions.typingSlug({ slug }));
  }

  /**
   * When the dumb UI emits a formattedSlug event, dispatch it to the store.
   *
   * @param slug The slug to dispatch.
   */
  onFormattedSlug(slug: string): void {
    this.store.dispatch(TeamActions.checkSlug({ slug }));
  }

  /**
   * When the dumb UI emits an edit event, send an edit action with the new name value.
   *
   * @param updateTeamDto The value to send to the backend.
   */
  onEdit(updateTeamDto: BaseUpdateTeamDto): void {
    this.store.dispatch(TeamActions.editTeam({ updateTeamDto }));
  }

  /**
   * When the dumb UI emits an edit slug event, send an edit slug action with the new slug value.
   *
   * @param slug The new value for the team's slug.
   */
  onEditSlug(slug: string): void {
    this.store.dispatch(TeamActions.editTeamSlug({ updateTeamDto: { slug } }));
  }

  /**
   * When the dumb UI emits a delete team event, dispatch it to the store.
   */
  onDelete(): void {
    this.store.dispatch(TeamActions.deleteTeam());
  }
}
