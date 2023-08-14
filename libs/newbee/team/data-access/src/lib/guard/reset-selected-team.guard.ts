import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { TeamActions, teamFeature } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';
import { map, Observable, skipWhile, take } from 'rxjs';

/**
 * A guard that fires the request to reset the selected team.
 * Only fires when the user is attempting to navigate away from the component it encompasses.
 *
 * @returns `true` after the selected team has been reset.
 */
export const resetSelectedTeamGuard: CanDeactivateFn<
  unknown
> = (): Observable<boolean> => {
  const store = inject(Store);
  store.dispatch(TeamActions.resetSelectedTeam());
  return store.select(teamFeature.selectSelectedTeam).pipe(
    skipWhile((selectedTeam) => !!selectedTeam),
    take(1),
    map(() => true)
  );
};
