import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchHttpError,
  OrganizationActions,
} from '@newbee/newbee/shared/data-access';
import {
  nameIsNotEmpty,
  organizationSlugTakenBadRequest,
  slugIsNotEmpty,
} from '@newbee/shared/util';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, switchMap, tap } from 'rxjs';
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
      switchMap(({ createOrgForm }) => {
        return this.organizationService.create(createOrgForm).pipe(
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

  checkSlug$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.checkSlug),
      filter(({ slug }) => !!slug),
      switchMap(({ slug }) => {
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
