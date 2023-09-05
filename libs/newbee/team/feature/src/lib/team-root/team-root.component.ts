import { Component, NgZone, OnDestroy } from '@angular/core';
import { TeamActions } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';

/**
 * A root router wrapper component for the selected team routes.
 */
@Component({
  selector: 'newbee-team-root',
  templateUrl: './team-root.component.html',
})
export class TeamRootComponent implements OnDestroy {
  constructor(private readonly store: Store, private readonly ngZone: NgZone) {}

  /**
   * Reset the selected team when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.ngZone.run(() => {
      this.store.dispatch(TeamActions.resetSelectedTeam());
    });
  }
}
