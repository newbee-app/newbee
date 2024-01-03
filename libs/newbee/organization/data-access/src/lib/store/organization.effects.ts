import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchHttpClientError,
  catchHttpScreenError,
  OrganizationActions,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { ShortUrl } from '@newbee/newbee/shared/util';
import {
  Keyword,
  nameIsNotEmpty,
  organizationSlugTakenBadRequest,
  slugIsNotEmpty,
  upToDateDurationMatches,
} from '@newbee/shared/util';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { OrganizationService } from '../organization.service';

/**
 * The effects tied to `OrganizationActions`.
 */
@Injectable()
export class OrganizationEffects {
  getOrg$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.getOrg),
      switchMap(({ orgSlug }) => {
        return this.organizationService.get(orgSlug).pipe(
          map((orgAndMemberDto) => {
            return OrganizationActions.getOrgSuccess({ orgAndMemberDto });
          }),
          catchError(catchHttpScreenError),
        );
      }),
    );
  });

  createOrg$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.createOrg),
      switchMap(({ createOrganizationDto }) => {
        return this.organizationService.create(createOrganizationDto).pipe(
          map((organization) => {
            return OrganizationActions.createOrgSuccess({ organization });
          }),
          catchError((err) =>
            catchHttpClientError(err, (msg) => {
              switch (msg) {
                case organizationSlugTakenBadRequest:
                case slugIsNotEmpty:
                  return 'slug';
                case nameIsNotEmpty:
                  return 'name';
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

  createOrgSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(OrganizationActions.createOrgSuccess),
        tap(async ({ organization }) => {
          await this.router.navigate([
            `/${ShortUrl.Organization}/${organization.slug}`,
          ]);
        }),
      );
    },
    { dispatch: false },
  );

  editOrg$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.editOrg, OrganizationActions.editOrgSlug),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization),
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ type, updateOrganizationDto }, selectedOrganization]) => {
        return this.organizationService
          .edit(
            selectedOrganization?.organization.slug as string,
            updateOrganizationDto,
          )
          .pipe(
            map((organization) => {
              switch (type) {
                case OrganizationActions.editOrg.type:
                  return OrganizationActions.editOrgSuccess({
                    newOrg: organization,
                  });
                case OrganizationActions.editOrgSlug.type:
                  return OrganizationActions.editOrgSlugSuccess({
                    newOrg: organization,
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
                    return type === OrganizationActions.editOrg.type
                      ? `${Keyword.Organization}-${Keyword.Edit}`
                      : `${Keyword.Organization}-${Keyword.Slug}-${Keyword.Edit}`;
                }
              }),
            ),
          );
      }),
    );
  });

  editOrgSlugSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(OrganizationActions.editOrgSlugSuccess),
        tap(async ({ newOrg }) => {
          await this.router.navigate([
            `/${ShortUrl.Organization}/${newOrg.slug}/${Keyword.Edit}`,
          ]);
        }),
      );
    },
    { dispatch: false },
  );

  deleteOrg$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.deleteOrg),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization),
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([, selectedOrganization]) => {
        return this.organizationService
          .delete(selectedOrganization?.organization.slug as string)
          .pipe(
            map(() => {
              return OrganizationActions.deleteOrgSuccess();
            }),
            catchError((err) =>
              catchHttpClientError(
                err,
                () => `${Keyword.Organization}-${Keyword.Delete}`,
              ),
            ),
          );
      }),
    );
  });

  deleteOrgSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(OrganizationActions.deleteOrgSuccess),
        tap(async () => {
          await this.router.navigate(['/']);
        }),
      );
    },
    { dispatch: false },
  );

  checkSlug$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.checkSlug),
      filter(({ slug }) => !!slug),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization),
      ),
      switchMap(([{ slug }, selectedOrganization]) => {
        if (selectedOrganization?.organization.slug === slug) {
          return of(OrganizationActions.checkSlugSuccess({ slugTaken: false }));
        }

        return this.organizationService.checkSlug(slug).pipe(
          map(({ slugTaken }) => {
            return OrganizationActions.checkSlugSuccess({ slugTaken });
          }),
        );
      }),
    );
  });

  generateSlug$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.generateSlug),
      filter(({ name }) => !!name),
      switchMap(({ name }) => {
        return this.organizationService.generateSlug(name).pipe(
          map(({ generatedSlug }) => {
            return OrganizationActions.generateSlugSuccess({
              slug: generatedSlug,
            });
          }),
        );
      }),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly organizationService: OrganizationService,
    private readonly store: Store,
    private readonly router: Router,
  ) {}
}
