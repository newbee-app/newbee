import { Component, NgZone, OnDestroy } from '@angular/core';
import { DocActions } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';

/**
 * A root router wrapper component for the selected doc routes.
 */
@Component({
  selector: 'newbee-doc-root',
  templateUrl: './doc-root.component.html',
})
export class DocRootComponent implements OnDestroy {
  constructor(
    private readonly store: Store,
    private readonly ngZone: NgZone,
  ) {}

  /**
   * Resets the selected doc when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.ngZone.run(() => {
      this.store.dispatch(DocActions.resetSelectedDoc());
    });
  }
}
