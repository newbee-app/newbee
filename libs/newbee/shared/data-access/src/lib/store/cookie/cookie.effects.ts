import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertType,
  Button,
  Toast,
  ToastXPosition,
  ToastYPosition,
  unverifiedUserEmailAlert,
} from '@newbee/newbee/shared/util';
import { Keyword } from '@newbee/shared/util';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, switchMap } from 'rxjs';
import { catchHttpScreenError } from '../../function';
import { CookieService } from '../../service';
import { ToastActions } from '../toast';
import { CookieActions } from './cookie.actions';
import { cookieFeature } from './cookie.reducer';

/**
 * The effects tied to `CookieActions`.
 */
@Injectable()
export class CookieEffects {
  initCookies$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CookieActions.initCookies),
      concatLatestFrom(() => this.store.select(cookieFeature.selectCsrfToken)),
      filter(([, token]) => !token),
      switchMap(() => {
        return this.cookieService.initCookies().pipe(
          map((csrfTokenAndDataDto) => {
            return CookieActions.initCookiesSuccess({ csrfTokenAndDataDto });
          }),
          catchError(catchHttpScreenError),
        );
      }),
    );
  });

  initCookiesSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CookieActions.initCookiesSuccess),
      filter(({ csrfTokenAndDataDto }) => {
        const { userRelation } = csrfTokenAndDataDto;
        return !!(
          userRelation &&
          userRelation.user &&
          !userRelation.user.emailVerified
        );
      }),
      map(() => {
        return ToastActions.addToast({
          toast: new Toast(
            unverifiedUserEmailAlert.header,
            unverifiedUserEmailAlert.text,
            AlertType.Warning,
            [ToastXPosition.Center, ToastYPosition.Bottom],
            3000,
            new Button(
              'User Settings',
              this.navigateToUser,
              null,
              false,
              false,
            ),
          ),
        });
      }),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly router: Router,
    private readonly cookieService: CookieService,
  ) {}

  /**
   * A helper function for navigating to the user route.
   */
  readonly navigateToUser = async (): Promise<void> => {
    await this.router.navigate([`/${Keyword.User}`]);
  };
}
