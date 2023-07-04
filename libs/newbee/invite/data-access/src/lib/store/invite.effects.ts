import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchHttpScreenError,
  InviteActions,
} from '@newbee/newbee/shared/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs';
import { InviteService } from '../invite.service';

/**
 * The effects tied to invites.
 */
@Injectable()
export class InviteEffects {
  acceptInvite$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InviteActions.acceptInvite),
      switchMap(({ tokenDto }) => {
        return this.inviteService.acceptInvite(tokenDto).pipe(
          map((orgMember) => {
            return InviteActions.acceptInviteSuccess({ orgMember });
          }),
          catchError(catchHttpScreenError)
        );
      })
    );
  });

  declineInvite$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InviteActions.declineInvite),
      switchMap(({ tokenDto }) => {
        return this.inviteService.declineInvite(tokenDto).pipe(
          map(() => {
            return InviteActions.declineInviteSuccess();
          }),
          catchError(catchHttpScreenError)
        );
      })
    );
  });

  inviteSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          InviteActions.acceptInviteSuccess,
          InviteActions.declineInviteSuccess
        ),
        tap(async () => {
          await this.router.navigate(['/']);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly inviteService: InviteService,
    private readonly router: Router
  ) {}
}
