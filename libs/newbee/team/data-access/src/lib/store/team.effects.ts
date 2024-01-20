import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchHttpClientError,
  catchHttpScreenError,
  organizationFeature,
  TeamActions,
} from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  defaultLimit,
  Keyword,
  nameIsNotEmpty,
  OffsetAndLimit,
  Organization,
  slugIsNotEmpty,
  teamRoleIsEnum,
  teamSlugTakenBadRequest,
  upToDateDurationMatches,
} from '@newbee/shared/util';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { TeamService } from '../team.service';
import {
  selectTeamAndOrg,
  selectTeamAndOrgStates,
  selectTeamPostsAndOrg,
} from './team.selector';

@Injectable()
export class TeamEffects {
  getTeam$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActions.getTeam),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization),
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ slug }, selectedOrganization]) => {
        return this.teamService
          .get(slug, selectedOrganization?.organization.slug as string)
          .pipe(
            map((teamAndMemberDto) => {
              return TeamActions.getTeamSuccess({ teamAndMemberDto });
            }),
            catchError(catchHttpScreenError),
          );
      }),
    );
  });

  createTeam$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActions.createTeam),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization),
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ createTeamDto }, selectedOrganization]) => {
        const organization = selectedOrganization?.organization as Organization;
        return this.teamService.create(createTeamDto, organization.slug).pipe(
          map((team) => {
            return TeamActions.createTeamSuccess({ organization, team });
          }),
          catchError((err) =>
            catchHttpClientError(err, (msg) => {
              switch (msg) {
                case nameIsNotEmpty:
                  return 'name';
                case slugIsNotEmpty:
                case teamSlugTakenBadRequest:
                  return 'slug';
                case upToDateDurationMatches:
                  return 'upToDateDuration';
                default:
                  return Keyword.Misc;
              }
            }),
          ),
        );
      }),
    );
  });

  createTeamSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TeamActions.createTeamSuccess),
        concatLatestFrom(() =>
          this.store.select(organizationFeature.selectSelectedOrganization),
        ),
        filter(([, selectedOrganization]) => !!selectedOrganization),
        tap(async ([{ team }, selectedOrganization]) => {
          await this.router.navigate([
            `/${ShortUrl.Organization}/${
              selectedOrganization?.organization.slug as string
            }/${ShortUrl.Team}/${team.slug}`,
          ]);
        }),
      );
    },
    { dispatch: false },
  );

  editTeam$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActions.editTeam, TeamActions.editTeamSlug),
      concatLatestFrom(() => this.store.select(selectTeamAndOrg)),
      filter(
        ([, { selectedOrganization, selectedTeam }]) =>
          !!selectedOrganization && !!selectedTeam,
      ),
      switchMap(
        ([{ type, updateTeamDto }, { selectedOrganization, selectedTeam }]) => {
          const oldTeamSlug = selectedTeam?.team.slug as string;
          return this.teamService
            .edit(
              selectedOrganization?.organization.slug as string,
              oldTeamSlug,
              updateTeamDto,
            )
            .pipe(
              map((team) => {
                switch (type) {
                  case TeamActions.editTeam.type:
                    return TeamActions.editTeamSuccess({
                      oldSlug: oldTeamSlug,
                      newTeam: team,
                    });
                  case TeamActions.editTeamSlug.type:
                    return TeamActions.editTeamSlugSuccess({
                      oldSlug: oldTeamSlug,
                      newTeam: team,
                    });
                }
              }),
              catchError((err) =>
                catchHttpClientError(err, (message) => {
                  switch (message) {
                    case nameIsNotEmpty:
                      return 'name';
                    case upToDateDurationMatches:
                      return 'upToDateDuration';
                    default:
                      return type === TeamActions.editTeam.type
                        ? `${Keyword.Team}-${Keyword.Edit}`
                        : `${Keyword.Team}-${Keyword.Slug}-${Keyword.Edit}`;
                  }
                }),
              ),
            );
        },
      ),
    );
  });

  editTeamSlugSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TeamActions.editTeamSlugSuccess),
        concatLatestFrom(() =>
          this.store.select(organizationFeature.selectSelectedOrganization),
        ),
        filter(([, selectedOrganization]) => !!selectedOrganization),
        tap(async ([{ newTeam }, selectedOrganization]) => {
          await this.router.navigate([
            `/${ShortUrl.Organization}/${
              selectedOrganization?.organization.slug as string
            }/${ShortUrl.Team}/${newTeam.slug}/${Keyword.Edit}`,
          ]);
        }),
      );
    },
    { dispatch: false },
  );

  deleteTeam$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActions.deleteTeam),
      concatLatestFrom(() => this.store.select(selectTeamAndOrg)),
      filter(
        ([, { selectedOrganization, selectedTeam }]) =>
          !!selectedOrganization && !!selectedTeam,
      ),
      switchMap(([, { selectedOrganization, selectedTeam }]) => {
        const teamSlug = selectedTeam?.team.slug as string;
        return this.teamService
          .delete(selectedOrganization?.organization.slug as string, teamSlug)
          .pipe(
            map(() => {
              return TeamActions.deleteTeamSuccess({ slug: teamSlug });
            }),
            catchError((err) =>
              catchHttpClientError(
                err,
                () => `${Keyword.Team}-${Keyword.Delete}`,
              ),
            ),
          );
      }),
    );
  });

  deleteTeamSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TeamActions.deleteTeamSuccess),
        concatLatestFrom(() =>
          this.store.select(organizationFeature.selectSelectedOrganization),
        ),
        tap(async ([, selectedOrganization]) => {
          if (!selectedOrganization) {
            await this.router.navigate(['/']);
            return;
          }

          await this.router.navigate([
            `/${ShortUrl.Organization}/${selectedOrganization.organization.slug}`,
          ]);
        }),
      );
    },
    { dispatch: false },
  );

  checkSlug$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActions.checkSlug),
      filter(({ slug }) => !!slug),
      concatLatestFrom(() => this.store.select(selectTeamAndOrg)),
      filter(([, { selectedOrganization }]) => !!selectedOrganization),
      switchMap(([{ slug }, { selectedOrganization, selectedTeam }]) => {
        if (selectedTeam?.team.slug === slug) {
          return of(TeamActions.checkSlugSuccess({ slugTaken: false }));
        }

        return this.teamService
          .checkSlug(slug, selectedOrganization?.organization.slug as string)
          .pipe(
            map(({ slugTaken }) => {
              return TeamActions.checkSlugSuccess({ slugTaken });
            }),
          );
      }),
    );
  });

  generateSlug$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActions.generateSlug),
      filter(({ name }) => !!name),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization),
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ name }, selectedOrganization]) => {
        return this.teamService
          .generateSlug(name, selectedOrganization?.organization.slug as string)
          .pipe(
            map((generatedSlugDto) => {
              const { generatedSlug } = generatedSlugDto;
              return TeamActions.generateSlugSuccess({ slug: generatedSlug });
            }),
          );
      }),
    );
  });

  getDocs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActions.getDocs),
      concatLatestFrom(() => this.store.select(selectTeamPostsAndOrg)),
      filter(
        ([, { selectedTeam, selectedOrganization }]) =>
          !!(selectedOrganization && selectedTeam),
      ),
      switchMap(([, { docs, selectedTeam, selectedOrganization }]) => {
        if (docs && docs.total <= docs.limit * (docs.offset + 1)) {
          return of(TeamActions.getDocsSuccess({ docs }));
        }

        const offsetAndLimit: OffsetAndLimit = {
          offset: docs ? docs.offset + 1 : 0,
          limit: docs ? docs.limit : defaultLimit,
        };
        return this.teamService
          .getAllDocs(
            selectedOrganization?.organization.slug as string,
            selectedTeam?.team.slug as string,
            offsetAndLimit,
          )
          .pipe(
            map((docs) => {
              return TeamActions.getDocsSuccess({ docs });
            }),
            catchError((err) => catchHttpClientError(err, () => Keyword.Misc)),
          );
      }),
    );
  });

  getQnas$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActions.getQnas),
      concatLatestFrom(() => this.store.select(selectTeamPostsAndOrg)),
      filter(
        ([, { selectedTeam, selectedOrganization }]) =>
          !!(selectedOrganization && selectedTeam),
      ),
      switchMap(([, { qnas, selectedTeam, selectedOrganization }]) => {
        if (qnas && qnas.total <= qnas.limit * (qnas.offset + 1)) {
          return of(TeamActions.getQnasSuccess({ qnas }));
        }

        const offsetAndLimit: OffsetAndLimit = {
          offset: qnas ? qnas.offset + 1 : 0,
          limit: qnas ? qnas.limit : defaultLimit,
        };
        return this.teamService
          .getAllQnas(
            selectedOrganization?.organization.slug as string,
            selectedTeam?.team.slug as string,
            offsetAndLimit,
          )
          .pipe(
            map((qnas) => {
              return TeamActions.getQnasSuccess({ qnas });
            }),
            catchError((err) => catchHttpClientError(err, () => Keyword.Misc)),
          );
      }),
    );
  });

  addTeamMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActions.addTeamMember),
      concatLatestFrom(() => this.store.select(selectTeamAndOrgStates)),
      filter(
        ([
          ,
          {
            orgState: { selectedOrganization },
            teamState: { selectedTeam },
          },
        ]) => !!(selectedOrganization && selectedTeam),
      ),
      switchMap(
        ([
          { createTeamMemberDto },
          {
            orgState: { selectedOrganization, orgMember },
            teamState: { selectedTeam },
          },
        ]) => {
          const orgSlug = selectedOrganization?.organization.slug as string;
          const teamSlug = selectedTeam?.team.slug as string;
          const selectedOrgMemberSlug = orgMember?.orgMember.slug;

          return this.teamService
            .createTeamMember(createTeamMemberDto, orgSlug, teamSlug)
            .pipe(
              switchMap((teamMember) => {
                const toReturn: Action[] = [
                  TeamActions.addTeamMemberSuccess({ teamMember }),
                ];
                if (selectedOrgMemberSlug === teamMember.orgMember.slug) {
                  toReturn.push(
                    TeamActions.editCurrentTeamMember({
                      teamMember: teamMember.teamMember,
                    }),
                  );
                }

                return toReturn;
              }),
              catchError((err) =>
                catchHttpClientError(err, (message) => {
                  switch (message) {
                    case teamRoleIsEnum:
                      return 'role';
                    case slugIsNotEmpty:
                      return 'member';
                    default:
                      return `${Keyword.TeamMember}-${Keyword.New}`;
                  }
                }),
              ),
            );
        },
      ),
    );
  });

  editTeamMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActions.editTeamMember),
      concatLatestFrom(() => this.store.select(selectTeamAndOrgStates)),
      filter(
        ([
          ,
          {
            orgState: { selectedOrganization },
            teamState: { selectedTeam },
          },
        ]) => !!(selectedOrganization && selectedTeam),
      ),
      switchMap(
        ([
          { orgMemberSlug, updateTeamMemberDto },
          {
            orgState: { selectedOrganization, orgMember },
            teamState: { selectedTeam },
          },
        ]) => {
          const orgSlug = selectedOrganization?.organization.slug as string;
          const teamSlug = selectedTeam?.team.slug as string;
          const selectedOrgMemberSlug = orgMember?.orgMember.slug;

          return this.teamService
            .editTeamMember(
              updateTeamMemberDto,
              orgSlug,
              teamSlug,
              orgMemberSlug,
            )
            .pipe(
              switchMap((teamMember) => {
                const toReturn: Action[] = [
                  TeamActions.editTeamMemberSuccess({
                    teamMember,
                    orgMemberSlug,
                  }),
                ];
                if (orgMemberSlug === selectedOrgMemberSlug) {
                  toReturn.push(
                    TeamActions.editCurrentTeamMember({ teamMember }),
                  );
                }

                return toReturn;
              }),
              catchError((err) =>
                catchHttpClientError(
                  err,
                  () =>
                    `${Keyword.TeamMember}-${Keyword.Edit}-${orgMemberSlug}`,
                ),
              ),
            );
        },
      ),
    );
  });

  deleteTeamMember$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActions.deleteTeamMember),
      concatLatestFrom(() => this.store.select(selectTeamAndOrgStates)),
      filter(
        ([
          ,
          {
            orgState: { selectedOrganization },
            teamState: { selectedTeam },
          },
        ]) => !!(selectedOrganization && selectedTeam),
      ),
      switchMap(
        ([
          { orgMemberSlug },
          {
            orgState: { selectedOrganization, orgMember },
            teamState: { selectedTeam },
          },
        ]) => {
          const orgSlug = selectedOrganization?.organization.slug as string;
          const teamSlug = selectedTeam?.team.slug as string;
          const selectedOrgMemberSlug = orgMember?.orgMember.slug;

          return this.teamService
            .deleteTeamMember(orgSlug, teamSlug, orgMemberSlug)
            .pipe(
              switchMap(() => {
                const toReturn: Action[] = [
                  TeamActions.deleteTeamMemberSuccess({ orgMemberSlug }),
                ];
                if (orgMemberSlug === selectedOrgMemberSlug) {
                  toReturn.push(
                    TeamActions.editCurrentTeamMember({ teamMember: null }),
                  );
                }

                return toReturn;
              }),
              catchError((err) =>
                catchHttpClientError(
                  err,
                  () =>
                    `${Keyword.TeamMember}-${Keyword.Delete}-${orgMemberSlug}`,
                ),
              ),
            );
        },
      ),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly teamService: TeamService,
    private readonly store: Store,
    private readonly router: Router,
  ) {}
}
