import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthenticatorActions } from '@newbee/newbee/shared/data-access';
import { Authenticator } from '@newbee/shared/util';
import { Store } from '@ngrx/store';
import { Observable, map, skipWhile, take } from 'rxjs';
import { selectAuthenticatorsAndScreenError } from '../store';

/**
 * A resolver to get all of the user's authenticators.
 *
 * @returns The user's authenticators in an array, or an empty array if there was an error.
 */
export const authenticatorsResolver: ResolveFn<
  Authenticator[]
> = (): Observable<Authenticator[]> => {
  const store = inject(Store);

  store.dispatch(AuthenticatorActions.getAuthenticators());
  return store.select(selectAuthenticatorsAndScreenError).pipe(
    skipWhile(
      ({ authenticators, screenError }) => !authenticators && !screenError,
    ),
    take(1),
    map(({ authenticators }) => authenticators ?? []),
  );
};
