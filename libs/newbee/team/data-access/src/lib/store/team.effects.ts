import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchHttpClientError,
  catchHttpScreenError,
  organizationFeature,
  ShortUrl,
  TeamActions,
  teamFeature,
} from '@newbee/newbee/shared/data-access';
import {
  Keyword,
  nameIsNotEmpty,
  slugIsNotEmpty,
  teamSlugTakenBadRequest,
} from '@newbee/shared/util';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
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
            catchError((err) =>
              catchHttpClientError(err, (msg) => {
                switch (msg) {
                  case nameIsNotEmpty:
                    return 'name';
                  case slugIsNotEmpty:
                  case teamSlugTakenBadRequest:
                    return 'slug';
                  default:
                    return Keyword.Misc;
                }
              })
            )
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
            `/${ShortUrl.Organization}/${
              selectedOrganization?.slug as string
            }/${ShortUrl.Team}/${team.slug}`,
          ]);
        })
      );
    },
    { dispatch: false }
  );

  editTeam$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActions.editTeam, TeamActions.editTeamSlug),
      concatLatestFrom(() => [
        this.store.select(organizationFeature.selectSelectedOrganization),
        this.store.select(teamFeature.selectSelectedTeam),
      ]),
      filter(
        ([, selectedOrganization, selectedTeam]) =>
          !!selectedOrganization && !!selectedTeam
      ),
      switchMap(
        ([{ type, updateTeamDto }, selectedOrganization, selectedTeam]) => {
          return this.teamService
            .edit(
              selectedOrganization?.slug as string,
              selectedTeam?.team.slug as string,
              updateTeamDto
            )
            .pipe(
              map((team) => {
                switch (type) {
                  case TeamActions.editTeam.type:
                    return TeamActions.editTeamSuccess({ newTeam: team });
                  case TeamActions.editTeamSlug.type:
                    return TeamActions.editTeamSlugSuccess({ newTeam: team });
                }
              }),
              catchError((err) =>
                catchHttpClientError(
                  err,
                  () => `${Keyword.Team}-${Keyword.Edit}`
                )
              )
            );
        }
      )
    );
  });

  editTeamSlugSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TeamActions.editTeamSlugSuccess),
        concatLatestFrom(() =>
          this.store.select(organizationFeature.selectSelectedOrganization)
        ),
        filter(([, selectedOrganization]) => !!selectedOrganization),
        tap(async ([{ newTeam }, selectedOrganization]) => {
          await this.router.navigate([
            `/${ShortUrl.Organization}/${
              selectedOrganization?.slug as string
            }/${ShortUrl.Team}/${newTeam.slug}/${Keyword.Edit}`,
          ]);
        })
      );
    },
    { dispatch: false }
  );

  deleteTeam$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActions.deleteTeam),
      concatLatestFrom(() => [
        this.store.select(organizationFeature.selectSelectedOrganization),
        this.store.select(teamFeature.selectSelectedTeam),
      ]),
      filter(
        ([, selectedOrganization, selectedTeam]) =>
          !!selectedOrganization && !!selectedTeam
      ),
      switchMap(([, selectedOrganization, selectedTeam]) => {
        return this.teamService
          .delete(
            selectedOrganization?.slug as string,
            selectedTeam?.team.slug as string
          )
          .pipe(
            map(() => {
              return TeamActions.deleteTeamSuccess();
            }),
            catchError((err) =>
              catchHttpClientError(
                err,
                () => `${Keyword.Team}-${Keyword.Delete}`
              )
            )
          );
      })
    );
  });

  deleteTeamSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TeamActions.deleteTeamSuccess),
        concatLatestFrom(() =>
          this.store.select(organizationFeature.selectSelectedOrganization)
        ),
        tap(async ([, selectedOrganization]) => {
          if (!selectedOrganization) {
            await this.router.navigate(['/']);
            return;
          }

          await this.router.navigate([
            `/${ShortUrl.Organization}/${selectedOrganization.slug}`,
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
      concatLatestFrom(() => [
        this.store.select(organizationFeature.selectSelectedOrganization),
        this.store.select(teamFeature.selectSelectedTeam),
      ]),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ slug }, selectedOrganization, selectedTeam]) => {
        if (selectedTeam?.team.slug === slug) {
          return of(TeamActions.checkSlugSuccess({ slugTaken: false }));
        }

        return this.teamService
          .checkSlug(slug, selectedOrganization?.slug as string)
          .pipe(
            map(({ slugTaken }) => {
              return TeamActions.checkSlugSuccess({ slugTaken });
            })
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
            })
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
}
