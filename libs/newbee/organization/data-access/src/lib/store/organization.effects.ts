import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchHttpError,
  OrganizationActions,
  organizationFeature,
} from '@newbee/newbee/shared/data-access';
import { UrlEndpoint } from '@newbee/shared/data-access';
import {
  nameIsNotEmpty,
  organizationSlugTakenBadRequest,
  slugIsNotEmpty,
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
          map((orgMember) => {
            return OrganizationActions.getOrgSuccess({ orgMember });
          }),
          catchError(OrganizationEffects.catchHttpError)
        );
      })
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
          catchError(OrganizationEffects.catchHttpError)
        );
      })
    );
  });

  createOrgSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(OrganizationActions.createOrgSuccess),
        tap(async ({ organization }) => {
          await this.router.navigate([`/${organization.slug}`]);
        })
      );
    },
    { dispatch: false }
  );

  editOrg$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.editOrg),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization)
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ updateOrganizationDto }, selectedOrganization]) => {
        return this.organizationService
          .edit(
            selectedOrganization?.organization.slug as string,
            updateOrganizationDto
          )
          .pipe(
            map((organization) => {
              return OrganizationActions.editOrgSuccess({
                newOrg: organization,
              });
            }),
            catchError(OrganizationEffects.catchHttpError)
          );
      })
    );
  });

  editOrgSlug$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.editOrgSlug),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization)
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([{ updateOrganizationDto }, selectedOrganization]) => {
        return this.organizationService
          .edit(
            selectedOrganization?.organization.slug as string,
            updateOrganizationDto
          )
          .pipe(
            map((organization) => {
              return OrganizationActions.editOrgSlugSuccess({
                newOrg: organization,
              });
            }),
            catchError(OrganizationEffects.catchHttpError)
          );
      })
    );
  });

  editOrgSlugSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(OrganizationActions.editOrgSlugSuccess),
        tap(async ({ newOrg }) => {
          await this.router.navigate([`/${newOrg.slug}/${UrlEndpoint.Edit}`]);
        })
      );
    },
    { dispatch: false }
  );

  deleteOrg$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.deleteOrg),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization)
      ),
      filter(([, selectedOrganization]) => !!selectedOrganization),
      switchMap(([, selectedOrganization]) => {
        return this.organizationService
          .delete(selectedOrganization?.organization.slug as string)
          .pipe(
            map(() => {
              return OrganizationActions.deleteOrgSuccess();
            }),
            catchError(OrganizationEffects.catchHttpError)
          );
      })
    );
  });

  deleteOrgSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(OrganizationActions.deleteOrgSuccess),
        tap(async () => {
          await this.router.navigate(['/']);
        })
      );
    },
    { dispatch: false }
  );

  checkSlug$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.checkSlug),
      filter(({ slug }) => !!slug),
      concatLatestFrom(() =>
        this.store.select(organizationFeature.selectSelectedOrganization)
      ),
      switchMap(([{ slug }, selectedOrganization]) => {
        if (selectedOrganization?.organization.slug === slug) {
          return of(OrganizationActions.checkSlugSuccess({ slugTaken: false }));
        }

        return this.organizationService.checkSlug(slug).pipe(
          map(({ slugTaken }) => {
            return OrganizationActions.checkSlugSuccess({ slugTaken });
          }),
          catchError(OrganizationEffects.catchHttpError)
        );
      })
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
          catchError(OrganizationEffects.catchHttpError)
        );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly organizationService: OrganizationService,
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
        case organizationSlugTakenBadRequest:
        case slugIsNotEmpty:
          return 'slug';
        case nameIsNotEmpty:
          return 'name';
        default:
          return 'misc';
      }
    });
  }
}
