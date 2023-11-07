import { Component, OnDestroy } from '@angular/core';
import {
  TeamActions,
  httpFeature,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { teamFeature } from '@newbee/newbee/team/data-access';
import { BaseCreateTeamDto } from '@newbee/shared/data-access';
import { Store } from '@ngrx/store';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

/**
 * The smart UI for the create team screen.
 */
@Component({
  selector: 'newbee-team-create',
  templateUrl: './team-create.component.html',
})
export class TeamCreateComponent implements OnDestroy {
  /**
   * Represents the form's current name value, for use in generating slugs.
   */
  readonly name$ = new Subject<string>();

  /**
   * The organization the team is being created in.
   */
  selectedOrganization$ = this.store.select(
    organizationFeature.selectSelectedOrganization,
  );

  /**
   * The auto-generated slug based on the team's name.
   */
  generatedSlug$ = this.store.select(teamFeature.selectGeneratedSlug);

  /**
   * Whether the form's slug value is taken.
   */
  slugTaken$ = this.store.select(teamFeature.selectSlugTaken);

  /**
   * Whether the create action is pending.
   */
  pendingCreate$ = this.store.select(teamFeature.selectPendingCreate);

  /**
   * Whether the check slug action is pending.
   */
  pendingCheck$ = this.store.select(teamFeature.selectPendingCheck);

  /**
   * Request HTTP error, if any exist.
   */
  httpClientError$ = this.store.select(httpFeature.selectError);

  /**
   * Set up the `name$` slug to generate slug.
   */
  constructor(private readonly store: Store) {
    this.name$.pipe(debounceTime(600), distinctUntilChanged()).subscribe({
      next: (name) => {
        this.store.dispatch(TeamActions.generateSlug({ name }));
      },
    });
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.name$.complete();
  }

  /**
   * When the dumb UI emits a name event, emit it to the `name$` subject.
   *
   * @param name The name to dispatch.
   */
  onName(name: string): void {
    this.name$.next(name);
  }

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
   * When the dumb UI emits a create event, send a create action with the value of the team form.
   *
   * @param createTeamDto The values to send to the backend.
   */
  onCreate(createTeamDto: BaseCreateTeamDto): void {
    this.store.dispatch(TeamActions.createTeam({ createTeamDto }));
  }
}
