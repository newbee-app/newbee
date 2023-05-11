import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { catchHttpError } from '../../function';
import { OrganizationService } from '../../service';
import { OrganizationActions } from './organization.actions';

/**
 * The effects tied to `OrganizationActions`.
 */
@Injectable()
export class OrganizationEffects {
  getAndSelectOrg$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(OrganizationActions.getAndSelectOrg),
      switchMap(({ orgSlug }) => {
        if (!orgSlug) {
          return of(
            OrganizationActions.getAndSelectOrgSuccess({
              orgMember: null,
            })
          );
        }

        return this.organizationService.getAndSelectOrg(orgSlug).pipe(
          map((orgMember) => {
            return OrganizationActions.getAndSelectOrgSuccess({ orgMember });
          }),
          catchError(OrganizationEffects.catchHttpError)
        );
      })
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly organizationService: OrganizationService
  ) {}

  /**
   * Helper function to feed into `catchError` to capture HTTP errors from responses, convert them to the internal `HttpClientError` format, and save them in the store.
   *
   * @param err The HTTP error from the response.
   * @returns An observable containing the `[Http] Client Error` action.
   */
  private static catchHttpError(err: HttpErrorResponse) {
    return catchHttpError(err, () => 'misc');
  }
}
