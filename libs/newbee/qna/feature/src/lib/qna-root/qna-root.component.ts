import { Component, NgZone, OnDestroy } from '@angular/core';
import { QnaActions } from '@newbee/newbee/shared/data-access';
import { Store } from '@ngrx/store';

/**
 * A root router wrapper component for the selected qna routes.
 */
@Component({
  selector: 'newbee-qna-root',
  templateUrl: './qna-root.component.html',
})
export class QnaRootComponent implements OnDestroy {
  constructor(
    private readonly store: Store,
    private readonly ngZone: NgZone,
  ) {}

  /**
   * Reset the selected qna when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.ngZone.run(() => {
      this.store.dispatch(QnaActions.resetSelectedQna());
    });
  }
}
