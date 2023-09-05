import { Component, NgZone, OnDestroy } from '@angular/core';
import { OrgMemberActions } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';

/**
 * A root route wrapper component for the selected org member routes.
 */
@Component({
  selector: 'newbee-org-member-root',
  templateUrl: './org-member-root.component.html',
})
export class OrgMemberRootComponent implements OnDestroy {
  constructor(private readonly store: Store, private readonly ngZone: NgZone) {}

  /**
   * Reset the selected org member when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.ngZone.run(() => {
      this.store.dispatch(OrgMemberActions.resetSelectedOrgMember());
    });
  }
}
