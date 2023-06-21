import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_REQUEST } from '@ngrx/router-store';
import { map } from 'rxjs';
import { RouterActions } from './router.actions';

/**
 * The effects tied to the router store.
 */
@Injectable()
export class RouterEffects {
  /**
   * Execute whenever the router attempts to navigate to any page.
   */
  routerRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_REQUEST),
      map(() => {
        return RouterActions.routerRequest();
      })
    );
  });

  constructor(private readonly actions$: Actions) {}
}
