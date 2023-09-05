import { Component, NgZone, OnDestroy } from '@angular/core';
import { OrganizationActions } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';

/**
 * A root route wrapper component for the selected org routes.
 */
@Component({
  selector: 'newbee-org-root',
  templateUrl: './org-root.component.html',
})
export class OrgRootComponent implements OnDestroy {
  constructor(
    private readonly store: Store,
    private readonly ngZone: NgZone,
  ) {}

  /**
   * Reset the selected org when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.ngZone.run(() => {
      this.store.dispatch(OrganizationActions.resetSelectedOrg());
    });
  }
}
