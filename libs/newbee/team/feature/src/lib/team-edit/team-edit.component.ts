import { Component } from '@angular/core';
import {
  httpFeature,
  organizationFeature,
  TeamActions,
  teamFeature,
} from '@newbee/newbee/shared/data-access';
import { teamFeature as teamModuleFeature } from '@newbee/newbee/team/data-access';
import { UpdateTeamDto } from '@newbee/shared/util';
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
   * The org state.
   */
  orgState$ = this.store.select(organizationFeature.selectOrgState);

  /**
   * The team state.
   */
  teamState$ = this.store.select(teamFeature.selectTeamState);

  /**
   * The team module state.
   */
  teamModuleState$ = this.store.select(teamModuleFeature.selectTeamModuleState);

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
  onEdit(updateTeamDto: UpdateTeamDto): void {
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
