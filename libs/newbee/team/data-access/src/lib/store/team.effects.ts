import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchHttpError,
  catchHttpScreenError,
  organizationFeature,
  TeamActions,
} from '@newbee/newbee/shared/data-access';
import { UrlEndpoint } from '@newbee/shared/data-access';
import {
  nameIsNotEmpty,
  slugIsNotEmpty,
  teamSlugTakenBadRequest,
} from '@newbee/shared/util';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap, tap } from 'rxjs';
import { TeamService } from '../team.service';

@Injectable()
export class TeamEffects {
  getTeam$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActions.getTeam),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization)
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ slug }, selectedOrganization]) => {
        return this.teamService
          .get(slug, selectedOrganization?.slug as string)
          .pipe(
            map((teamAndMemberDto) => {
              return TeamActions.getTeamSuccess({ teamAndMemberDto });
            }),
            catchError(catchHttpScreenError)
          );
      })
    );
  });

  createTeam$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActions.createTeam),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization)
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ createTeamDto }, selectedOrganization]) => {
        return this.teamService
          .create(createTeamDto, selectedOrganization?.slug as string)
          .pipe(
            map((team) => {
              return TeamActions.createTeamSuccess({ team });
            }),
            catchError(TeamEffects.catchHttpError)
          );
      })
    );
  });

  createTeamSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TeamActions.createTeamSuccess),
        concatLatestFrom(() =>
          this.store.select(organizationFeature.selectSelectedOrganization)
        ),
        filter(([, selectedOrganization]) => !!selectedOrganization),
        tap(async ([{ team }, selectedOrganization]) => {
          await this.router.navigate([
            `/${selectedOrganization?.slug as string}/${UrlEndpoint.Team}/${
              team.slug
            }`,
          ]);
        })
      );
    },
    { dispatch: false }
  );

  checkSlug$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActions.checkSlug),
      filter(({ slug }) => !!slug),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization)
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ slug }, selectedOrganization]) => {
        return this.teamService
          .checkSlug(slug, selectedOrganization?.slug as string)
          .pipe(
            map(({ slugTaken }) => {
              return TeamActions.checkSlugSuccess({ slugTaken });
            }),
            catchError(TeamEffects.catchHttpError)
          );
      })
    );
  });

  generateSlug$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActions.generateSlug),
      filter(({ name }) => !!name),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization)
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ name }, selectedOrganization]) => {
        return this.teamService
          .generateSlug(name, selectedOrganization?.slug as string)
          .pipe(
            map((generatedSlugDto) => {
              const { generatedSlug } = generatedSlugDto;
              return TeamActions.generateSlugSuccess({ slug: generatedSlug });
            }),
            catchError(TeamEffects.catchHttpError)
          );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly teamService: TeamService,
    private readonly store: Store,
    private readonly router: Router
  ) {}

  /**
   * Helper function to feed into `catchError` to capture HTTP errors from responses, convert them to the internal `HttpClientError` format, and save them in the store.
   *
   * @param err The HTTP error from the response.
   * @returns An observable containing the `[Http] Client Error` action.
   */
  private static catchHttpError(err: HttpErrorResponse) {
    return catchHttpError(err, (message) => {
      switch (message) {
        case nameIsNotEmpty:
          return 'name';
        case slugIsNotEmpty:
        case teamSlugTakenBadRequest:
          return 'slug';
        default:
          return 'misc';
      }
    });
  }
}
