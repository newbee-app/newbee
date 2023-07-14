import { Component, OnDestroy, OnInit } from '@angular/core';
import { httpFeature, TeamActions } from '@newbee/newbee/shared/data-access';
import { teamFeature } from '@newbee/newbee/team/data-access';
import {
  createTeamFormToDto,
  type CreateTeamForm,
} from '@newbee/newbee/team/util';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

/**
 * The smart UI for the create team screen.
 */
@Component({
  selector: 'newbee-team-create',
  templateUrl: './team-create.component.html',
})
export class TeamCreateComponent implements OnInit, OnDestroy {
  /**
   * Represents the form's current name value, for use in generating slugs.
   */
  readonly name$ = new Subject<string>();

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

  constructor(private readonly store: Store) {}

  /**
   * Set up the `name$` slug to generate slug.
   */
  ngOnInit(): void {
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
   * @param createTeamForm The values to send to the backend.
   */
  onCreate(createTeamForm: Partial<CreateTeamForm>): void {
    this.store.dispatch(
      TeamActions.createTeam({
        createTeamDto: createTeamFormToDto(createTeamForm),
      })
    );
  }
}
